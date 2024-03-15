import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { SignupDto } from '../dto/signup.dto';
import { SigninDto } from '../dto/signin.dto';
import { ClientGrpc } from '@nestjs/microservices';
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
  AccountSubjects,
  AgentSubjects,
  NotFoundError,
  ApiResponse,
} from '@app/common';
import { NatsJetStreamClientProxy } from '@nestjs-plugins/nestjs-nats-jetstream-transport';
import { ForbiddenAccessError } from '@app/common/errors/forbidden-access.error';
import { AgentModel } from 'apps/agent/src/Infrastructure/models/agent.model';

/**
 * Main service class for handling authentication
 */
@Injectable()
export class AuthService implements OnModuleInit {
  // The Grpc client methods for account and agent service
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

  async signup(signupDto: SignupDto): Promise<ApiResponse<AuthTokensDto>> {
    // check if account exists
    const { exists: accountExists } = await lastValueFrom(
      this.accountQueryService.accountExists({
        email: signupDto.email,
      }),
    );

    if (accountExists)
      return {
        success: false,
        error: {
          code: 404,
          message: 'Account already exists',
        },
      };

    // create an account for the new signup
    const { success: createAccountSuccess, data: createdAgent } =
      await lastValueFrom(
        this.natsClient.emit<ApiResponse<AgentModel | null>, SignupDto>(
          AccountSubjects.CREATE_ACCOUNT,
          signupDto,
        ),
      );

    if (!createAccountSuccess || !createdAgent)
      return {
        success: false,
        error: {
          code: 404,
          message: 'Could not create Account',
        },
      };

    const authTokens = await this.jwtUtils.generateTokens(
      createdAgent._id.toHexString(),
      createdAgent.email,
      createdAgent.account.toHexString(),
      createdAgent.role,
    );

    // update the refresh token for the agent
    this.natsClient.emit<void>(AgentSubjects.UPDATE_REFRESH_TOKEN, {
      agentId: createdAgent._id.toHexString(),
      newToken: authTokens.refreshToken,
    });

    return {
      success: true,
      data: authTokens,
    };
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

    if (!agent) throw new NotFoundError('Could not retrieve Agent');

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

  /**
   * Validate provided refresh token and genrate and return new tokens
   */
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
      throw new NotFoundError('Could not retrieve Agent or Its RefreshToken');

    // const tokenMatches =  await bcrypt.compare(refreshToken, agent.refreshToken);
    const tokenMatches = refreshToken === agent.refreshToken;

    if (!tokenMatches)
      throw new ForbiddenAccessError('Refresh Token is Invalid');

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
}
