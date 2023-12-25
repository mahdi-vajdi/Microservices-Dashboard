import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { SignupDto } from '../dto/signup.dto';
import { ClientGrpc, ClientProxy, RpcException } from '@nestjs/microservices';
import { lastValueFrom, map } from 'rxjs';
import * as bcrypt from 'bcryptjs';
import { Response } from 'express';
import { JwtHelperService } from './jwt-helper.service';
import {
  ACCOUNT_SERVICE,
  AGENT_SERVICE,
  AccountServiceClient,
  AgentDto,
  AgentRole,
  AuthTokensDto,
  SigninDto,
} from '@app/common';

export type AuthResponse = {
  email: string;
  agentId: string;
  access_token: string;
  refresh_token: string;
};

@Injectable()
export class AuthService implements OnModuleInit {
  private accountQueryService: AccountServiceClient;

  constructor(
    @Inject(AGENT_SERVICE) private readonly agentService: ClientProxy,
    @Inject(ACCOUNT_SERVICE)
    private readonly accountCommandService: ClientProxy,
    @Inject('ACCOUNT_PACKAGE') private readonly client: ClientGrpc,
    private readonly jwtUtils: JwtHelperService,
  ) {}

  onModuleInit() {
    this.accountQueryService =
      this.client.getService<AccountServiceClient>('AccountService');
  }

  async signup(signupDto: SignupDto): Promise<AuthTokensDto | null> {
    // check if account exists
    const { exists: itExists } = await lastValueFrom(
      this.accountQueryService.accountExists({
        email: signupDto.email,
      }),
    );

    if (itExists)
      throw new RpcException({
        statusCode: 409,
        message: 'Account already exists',
      });

    // check if agent exists
    const agentExists = await lastValueFrom(
      this.agentService.send<boolean>('agentExists', {
        email: signupDto.email,
        phone: signupDto.phone,
      }),
    );
    if (agentExists)
      throw new RpcException({
        statusCode: 409,
        message: 'Agent already exists',
      });

    // create an account for the new signup
    await lastValueFrom(
      this.accountCommandService.emit<void>('createAccount', {
        email: signupDto.email,
      }),
    );

    // get the created account
    const { account } = await lastValueFrom(
      this.accountQueryService.getAccountByEmail({
        email: signupDto.email,
      }),
    );
    if (!account)
      throw new RpcException({
        statusCode: 500,
        message: 'Something went wrong while creating account',
      });

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
    const agent = await lastValueFrom(
      this.agentService.send<AgentDto | null>('getAgentByEmail', {
        email: signupDto.email,
      }),
    );
    if (!agent) return null;

    const tokens = await this.jwtUtils.generateTokens(
      agent.id,
      agent.email,
      account.id,
      agent.role,
    );

    // update the refresh token for the agent
    this.agentService.emit<void>('updateRefreshToken', {
      agentId: agent.id,
      newToken: tokens.refreshToken,
    });

    return tokens;
  }

  async signin({ email, password }: SigninDto): Promise<AuthTokensDto | null> {
    const agent = await lastValueFrom(
      this.agentService
        .send<AgentDto | null>('getAgentByEmail', { email })
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
        ),
    );

    if (!agent) return null;

    const tokens = await this.jwtUtils.generateTokens(
      agent.id,
      agent.email,
      agent.account,
      agent.role,
    );

    this.agentService.emit<void>('updateRefreshToken', {
      agentId: agent.id,
      newToken: tokens.refreshToken,
    });

    return tokens;
  }

  signout(agentId: string): void {
    this.agentService.emit<void>('updateRefreshToken', {
      agentId: agentId,
      newToken: null,
    });
  }

  async refreshTokens(
    agentId: string,
    refreshToken: string,
  ): Promise<AuthTokensDto | null> {
    const agent = await lastValueFrom(
      this.agentService.send<AgentDto | null>('getAgentById', {
        agentId,
      }),
    );

    if (!agent || !agent.refreshToken) return null;

    // const tokenMatches =  await bcrypt.compare(refreshToken, agent.refreshToken);
    const tokenMatches = refreshToken === agent.refreshToken;

    if (!tokenMatches) return null;

    const tokens = await this.jwtUtils.generateTokens(
      agent.id,
      agent.email,
      agent.account,
      agent.role,
    );

    this.agentService.emit<void>('updateRefreshToken', {
      agentId: agent.id,
      newToken: tokens.refreshToken,
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
