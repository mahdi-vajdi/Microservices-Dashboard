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
  AgentRole,
} from '@app/common';
import { SignupDto } from './dto/signup.dto';
import { ClientProxy } from '@nestjs/microservices';
import { Observable, lastValueFrom, map } from 'rxjs';
import * as bcrypt from 'bcryptjs';
import { Response } from 'express';
import { AccountDto } from '@app/common/dto/account.dto';
import { JwtHelperService } from './jwt-helper.service';

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
    private readonly jwtUtils: JwtHelperService,
  ) {}

  async signup(
    signupDto: SignupDto,
  ): Promise<Observable<Promise<AuthResponse>>> {
    // check if account exists
    const accountExists = await lastValueFrom(
      this.accountService.send<boolean>('accountExists', {
        email: signupDto.email,
      }),
    );
    if (accountExists) throw new ConflictException('Account already exists');

    // check if agent exists
    const agentExists = await lastValueFrom(
      this.agentService.send<boolean>('agentExists', {
        email: signupDto.email,
        phone: signupDto.phone,
      }),
    );
    if (agentExists) throw new ConflictException('Agent already exists');

    // create an account for the new signup
    await lastValueFrom(
      this.accountService.emit<void>('createAccount', {
        email: signupDto.email,
      }),
    );

    // get the created account
    const account = await lastValueFrom(
      this.accountService.send<AccountDto>('getAccountByEmail', {
        email: signupDto.email,
      }),
    );
    if (!account)
      throw new InternalServerErrorException(
        'something went wrong while creating account',
      );

    // create a defualt agent for the new account
    await lastValueFrom(
      this.agentService.emit('createOwnerAgent', {
        accountId: account.id,
        firstName: signupDto.firstName,
        lastName: signupDto.lastName,
        email: signupDto.email,
        phone: signupDto.phone,
        password: await bcrypt.hash(signupDto.password, 10),
      }),
    );

    // get the create agent info
    return this.agentService
      .send<AgentDto | null>('getAgentByEmail', { email: signupDto.email })
      .pipe(
        map(async (agent) => {
          if (!agent)
            throw new InternalServerErrorException(
              'something went wrong while creating account',
            );
          // generate tokens for the agent
          const tokens = await this.jwtUtils.generateTokens(
            agent.id,
            agent.email,
            account.id,
            agent.role,
          );

          // insert the new refresh token in agent database
          this.agentService.emit<void>('updateRefreshToken', {
            agentId: agent.id,
            newToken: tokens.refresh_token,
          });

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
      agent.role,
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
      agent.role,
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
          if (
            agent &&
            (await bcrypt.compare(password, agent.password)) &&
            [AgentRole.OWNER, AgentRole.ADMIN].includes(agent.role)
          )
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
