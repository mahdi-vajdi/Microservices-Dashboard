import {
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  AGENT_SERVICE,
  JwtPayload,
  AgentDto,
  ACCOUNT_SERVICE,
} from '@app/common';
import { SignupDto } from './dto/signup.dto';
import { ClientProxy } from '@nestjs/microservices';
import { JwtUtils } from './jwt.util';
import { Observable, lastValueFrom, map } from 'rxjs';
import * as bcrypt from 'bcryptjs';
import { Response } from 'express';
import { AccountDto } from '@app/common/dto/account.dto';

export type AuthResponse = {
  email: string;
  agentId: string;
  access_token: string;
  refresh_token: string;
};

@Injectable()
export class AuthService {
  constructor(
    @Inject(AGENT_SERVICE) private readonly agentService: ClientProxy,
    @Inject(ACCOUNT_SERVICE) private readonly accountService: ClientProxy,
    private readonly jwtUtils: JwtUtils,
  ) {}

  async signup(
    signupDto: SignupDto,
  ): Promise<Observable<Promise<AuthResponse>>> {
    // check if email or phone exists
    const agentExists = await lastValueFrom(
      this.agentService.send<boolean>('agentExists', {
        email: signupDto.email,
        phone: signupDto.phone,
      }),
    );
    if (agentExists) throw new ConflictException('Agent already exists');

    // create an account for the new signup
    const account = await lastValueFrom(
      this.accountService.send<AccountDto>('createAccount', {
        email: signupDto.email,
      }),
    );
    if (!account)
      throw new InternalServerErrorException(
        'something went wrong while creating account',
      );

    return this.agentService
      .send<AgentDto>('createOwnerAgent', {
        accountId: account.id,
        firstName: signupDto.firstName,
        lastName: signupDto.lastName,
        email: signupDto.email,
        phone: signupDto.phone,
        password: await bcrypt.hash(signupDto.password, 10),
      })
      .pipe(
        map(async (agent) => {
          // generate tokens for the agent
          const tokens = await this.jwtUtils.generateTokens(
            agent.id,
            agent.email,
            account.id,
          );

          // insert the new refresh token in agent database
          this.agentService.emit<void>('updateRefreshToken', {
            agentId: agent.id,
            newToken: tokens.refresh_token,
          });

          console.debug(`agent ${JSON.stringify(agent)}`);
          return {
            email: agent.email,
            agentId: agent.id,
            ...tokens,
          };
        }),
      );
  }

  async signin(agent: AgentDto): Promise<AuthResponse> {
    const tokens = await this.jwtUtils.generateTokens(
      agent.id,
      agent.email,
      agent.account,
    );

    this.agentService.emit<void>('updateRefreshToken', {
      agentId: agent.id,
      newToken: tokens.refresh_token,
    });

    return {
      email: agent.email,
      agentId: agent.id,
      ...tokens,
    };
  }

  signout(agent: JwtPayload): void {
    this.agentService.emit<void>('updateRefreshToken', {
      agentId: agent.sub,
      newToken: null,
    });
  }

  async refreshTokens(agentPayload: JwtPayload, refreshToken: string) {
    const agent = await lastValueFrom(
      this.agentService.send<AgentDto | null>('getAgentById', {
        agentId: agentPayload.sub,
      }),
    );

    if (!agent || !agent.refreshToken) {
      throw new ForbiddenException('Access Denied');
    }

    // const tokenMatches =  await bcrypt.compare(refreshToken, agent.refreshToken);
    const tokenMatches = refreshToken === agent.refreshToken;

    if (!tokenMatches) throw new ForbiddenException('Acess Denied');

    const tokens = await this.jwtUtils.generateTokens(
      agent.id,
      agent.email,
      agent.account,
    );

    this.agentService.emit<void>('updateRefreshToken', {
      agentId: agent.id,
      newToken: tokens.refresh_token,
    });

    return tokens;
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<AgentDto | null> {
    const agent = this.agentService
      .send<AgentDto>('getAgentByEmail', { email })
      .pipe(
        map(async (agent) => {
          console.debug('validate agent', JSON.stringify(agent));
          if (agent && (await bcrypt.compare(password, agent.password)))
            return agent;
          else return null;
        }),
      );

    return await lastValueFrom(agent);
  }

  setTokensToCookies(
    res: Response,
    tokens: { access_token: string; refresh_token: string },
  ) {
    res.cookie('access_token', tokens.access_token, {
      maxAge: 1000 * 60 * 60,
      httpOnly: true,
    });
    res.cookie('refresh_token', tokens.refresh_token, {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
    });
  }
}
