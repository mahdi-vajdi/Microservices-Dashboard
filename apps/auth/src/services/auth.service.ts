import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { SignupDto } from '../dto/signup.dto';
import { ClientGrpc, RpcException } from '@nestjs/microservices';
import { lastValueFrom, map } from 'rxjs';
import * as bcrypt from 'bcryptjs';
import { JwtHelperService } from './jwt-helper.service';
import { AuthTokensDto } from '../dto/auth-tokens.dto';
import {
  AccountServiceClient,
  AgentRole,
  AgentServiceClient,
  GRPC_ACCOUNT,
  GRPC_AGENT,
  SigninDto,
  AccountSubjects,
  AgentSubjects,
} from '@app/common';
import { NatsJetStreamClientProxy } from '@nestjs-plugins/nestjs-nats-jetstream-transport';

export type AuthResponse = {
  email: string;
  agentId: string;
  access_token: string;
  refresh_token: string;
};

@Injectable()
export class AuthService implements OnModuleInit {
  private accountQueryService: AccountServiceClient;
  private agentQueryService: AgentServiceClient;

  constructor(
    private readonly natsClient: NatsJetStreamClientProxy,
    @Inject(GRPC_AGENT) private readonly agentGrpcClient: ClientGrpc,
    @Inject(GRPC_ACCOUNT)
    private readonly accountGrpcClient: ClientGrpc,
    private readonly jwtUtils: JwtHelperService,
  ) {}

  onModuleInit() {
    this.accountQueryService =
      this.accountGrpcClient.getService<AccountServiceClient>('AccountService');

    this.agentQueryService =
      this.agentGrpcClient.getService<AgentServiceClient>('AgentService');
  }

  async signup(signupDto: SignupDto): Promise<AuthTokensDto> {
    // check if account exists
    const { exists: accountExists } = await lastValueFrom(
      this.accountQueryService.accountExists({
        email: signupDto.email,
      }),
    );

    if (accountExists)
      throw new RpcException({
        statusCode: 409,
        message: 'Account already exists',
      });

    // check if agent exists
    const { agentExists } = await lastValueFrom(
      this.agentQueryService.agentExists({
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
      this.natsClient.emit<void>(AccountSubjects.CREATE_ACCOUNT, {
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
        statusCode: 404,
        message: 'Could not retrieve Account',
      });

    // create a defualt agent for the new account
    await lastValueFrom(
      this.natsClient.emit(AgentSubjects.CREATE_OWNER_AGENT, {
        accountId: account.id,
        firstName: signupDto.firstName,
        lastName: signupDto.lastName,
        email: signupDto.email,
        phone: signupDto.phone,
        password: await bcrypt.hash(signupDto.password, 10),
      }),
    );

    // get the create agent info
    const { agent } = await lastValueFrom(
      this.agentQueryService.getAgentByEmail({
        agentEmail: signupDto.email,
      }),
    );
    if (!agent)
      throw new RpcException({
        statusCode: 404,
        message: 'Could not retrieve Agent',
      });

    const tokens = await this.jwtUtils.generateTokens(
      agent.id,
      agent.email,
      account.id,
      AgentRole[agent.role],
    );

    // update the refresh token for the agent
    this.natsClient.emit<void>(AgentSubjects.UPDATE_REFRESH_TOKEN, {
      agentId: agent.id,
      newToken: tokens.refreshToken,
    });

    return tokens;
  }

  async signin({ email, password }: SigninDto): Promise<AuthTokensDto> {
    const agent = await lastValueFrom(
      this.agentQueryService.getAgentByEmail({ agentEmail: email }).pipe(
        map(async ({ agent }) => {
          if (
            agent &&
            (await bcrypt.compare(password, agent.password)) &&
            [AgentRole[AgentRole.OWNER], AgentRole[AgentRole.ADMIN]].includes(
              AgentRole[agent.role],
            )
          ) {
            return agent;
          } else return null;
        }),
      ),
    );

    if (!agent)
      throw new RpcException({
        statusCode: 404,
        message: 'Could not retrieve Agent',
      });

    const tokens = await this.jwtUtils.generateTokens(
      agent.id,
      agent.email,
      agent.account,
      AgentRole[agent.role],
    );

    this.natsClient.emit<void>(AgentSubjects.UPDATE_REFRESH_TOKEN, {
      agentId: agent.id,
      newToken: tokens.refreshToken,
    });

    return tokens;
  }

  signout(agentId: string): void {
    this.natsClient.emit<void>(AgentSubjects.UPDATE_REFRESH_TOKEN, {
      agentId: agentId,
      newToken: null,
    });
  }

  async refreshTokens(
    agentId: string,
    refreshToken: string,
  ): Promise<AuthTokensDto> {
    const { agent } = await lastValueFrom(
      this.agentQueryService.getAgentById({
        agentId,
      }),
    );

    if (!agent || !agent.refreshToken)
      throw new RpcException({
        statusCode: 404,
        message: 'Could not retrieve Agent or Its RefreshToken',
      });

    // const tokenMatches =  await bcrypt.compare(refreshToken, agent.refreshToken);
    const tokenMatches = refreshToken === agent.refreshToken;

    if (!tokenMatches)
      throw new RpcException({
        statusCode: 403,
        message: 'Refresh Token is Invalid',
      });

    const tokens = await this.jwtUtils.generateTokens(
      agent.id,
      agent.email,
      agent.account,
      AgentRole[agent.role],
    );

    this.natsClient.emit<void>(AgentSubjects.UPDATE_REFRESH_TOKEN, {
      agentId: agent.id,
      newToken: tokens.refreshToken,
    });

    return tokens;
  }

  // async validateUser(
  //   email: string,
  //   password: string,
  // ): Promise<AgentMessage | null> {
  //   const agent = await lastValueFrom(
  //     this.agentQueryService.getAgentByEmail({ agentEmail: email }).pipe(
  //       map(async ({ agent }) => {
  //         if (
  //           agent &&
  //           (await bcrypt.compare(password, agent.password)) &&
  //           [AgentRole.OWNER, AgentRole.ADMIN].includes(AgentRole[agent.role])
  //         )
  //           return agent;
  //         else return null;
  //       }),
  //     ),
  //   );

  //   if (!agent) return null;
  //   else return { ...agent, role: AgentRole[agent.role] };
  // }
}
