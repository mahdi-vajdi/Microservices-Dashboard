import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateOwnerAgentDto } from '../dto/create-owner-agent.dto';
import { UpdateRefreshTokenDto } from '../dto/update-refresh-token.dto';
import { UpdateRefreshTokenCommand } from '../commands/impl/update-refresh-token.command';
import { CreateAgentCommand } from '../commands/impl/create-agent.command';
import { CreateAgentDto } from '../dto/create-agent.dto';
import { AgentExistsQuery } from '../queries/impl/agent-exists-query';
import {
  AgentDto,
  AgentExistsResponse,
  AgentMessage,
  AgentResponse,
  AgentRole,
  AgentsIdsResponse,
  AgentsResponse,
  ApiResponse,
} from '@app/common';
import { GetByEmailQuery } from '../queries/impl/get-by-email.query';
import { AgentModel } from '../../Infrastructure/models/agent.model';
import { GetAccountAgentsQuery } from '../queries/impl/get-account-agents.query';
import { GetAccountAgentsIdsQuery } from '../queries/impl/get-account-agents-ids.query';
import { GetByIdQuery } from '../queries/impl/get-by-id.query';

@Injectable()
export class AgentService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  async createOwnerAgent(
    dto: CreateOwnerAgentDto,
  ): Promise<ApiResponse<AgentDto | null>> {
    try {
      // Check if the agent already exists
      const agentExists = await this.queryBus.execute<
        AgentExistsQuery,
        boolean
      >(new AgentExistsQuery(dto.email, dto.phone));
      if (agentExists)
        return {
          success: false,
          error: {
            code: 409,
            message: 'The agent already exists',
          },
        };

      // Create the agent
      await this.commandBus.execute<CreateAgentCommand, void>(
        new CreateAgentCommand(
          dto.accountId,
          dto.email,
          dto.phone,
          dto.firstName,
          dto.lastName,
          'Admin',
          [dto.channelId],
          dto.password,
          AgentRole.OWNER,
        ),
      );

      // Get the created agent from db
      const createdAgent = await this.queryBus.execute<
        GetByEmailQuery,
        AgentModel | null
      >(new GetByEmailQuery(dto.email));

      return {
        success: true,
        data: createdAgent ? this.toComamandDto(createdAgent) : null,
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 500,
          message: error.message,
        },
      };
    }
  }

  async createAgent(
    dto: CreateAgentDto,
  ): Promise<ApiResponse<AgentDto | null>> {
    try {
      // Check if the agent already exists
      const agentExists = await this.queryBus.execute<
        AgentExistsQuery,
        boolean
      >(new AgentExistsQuery(dto.email, dto.phone));
      if (agentExists)
        return {
          success: false,
          error: {
            code: 409,
            message: 'The agent already exists',
          },
        };

      // Create the agent
      await this.commandBus.execute<CreateAgentCommand, void>(
        new CreateAgentCommand(
          dto.accountId,
          dto.email,
          dto.phone,
          dto.firstName,
          dto.lastName,
          dto.title,
          dto.channelIds,
          dto.password,
          dto.role,
        ),
      );

      const createdAgent = await this.queryBus.execute<
        GetByEmailQuery,
        AgentModel | null
      >(new GetByEmailQuery(dto.email));

      return {
        success: true,
        data: createdAgent ? this.toComamandDto(createdAgent) : null,
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 500,
          message: error.message,
        },
      };
    }
  }

  async updateRefreshToken({
    agentId: id,
    newToken: token,
  }: UpdateRefreshTokenDto): Promise<ApiResponse<null>> {
    try {
      await this.commandBus.execute<UpdateRefreshTokenCommand, void>(
        new UpdateRefreshTokenCommand(id, token),
      );

      return {
        success: true,
        data: null,
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 500,
          message: error.message,
        },
      };
    }
  }

  async getAccountAgents(accountId: string): Promise<AgentsResponse> {
    const agents = await this.queryBus.execute<
      GetAccountAgentsQuery,
      AgentModel[]
    >(new GetAccountAgentsQuery(accountId));

    if (agents && agents.length > 0) {
      return {
        agents: agents.map((agent) => this.toGrpcModel(agent)),
      };
    } else return { agents: undefined };
  }

  async getAgentsIds(accountId: string): Promise<AgentsIdsResponse> {
    const agentsIds = await this.queryBus.execute<
      GetAccountAgentsIdsQuery,
      string[]
    >(new GetAccountAgentsIdsQuery(accountId));

    if (agentsIds && agentsIds.length > 0) {
      return {
        agentsIds,
      };
    } else return { agentsIds: undefined };
  }

  async getById(agentId: string): Promise<AgentResponse> {
    const agent = await this.queryBus.execute<GetByIdQuery, AgentModel>(
      new GetByIdQuery(agentId),
    );

    if (agent) {
      return {
        agent: this.toGrpcModel(agent),
      };
    } else return { agent: undefined };
  }

  async getByEmail(agentEmail: string): Promise<AgentResponse> {
    const agent = await this.queryBus.execute<
      GetByEmailQuery,
      AgentModel | null
    >(new GetByEmailQuery(agentEmail));

    if (agent) {
      return {
        agent: this.toGrpcModel(agent),
      };
    } else return { agent: undefined };
  }

  async agentExists(
    email: string,
    phone: string,
  ): Promise<AgentExistsResponse> {
    const agentExists = await this.queryBus.execute<AgentExistsQuery, boolean>(
      new AgentExistsQuery(email, phone),
    );

    if (agentExists) {
      return {
        agentExists,
      };
    } else return { agentExists: undefined };
  }

  private toComamandDto(agent: AgentModel): AgentDto {
    return {
      id: agent._id.toHexString(),
      createdAt: agent.createdAt,
      updatedAt: agent.updatedAt,
      account: agent.account.toHexString(),
      email: agent.email,
      phone: agent.phone,
      firstName: agent.firstName,
      lastName: agent.lastName,
      title: agent.title,
      refreshToken: agent.refreshToken,
      role: agent.role,
      avatar: agent.avatar,
      online: agent.online,
    };
  }

  private toGrpcModel(agent: AgentModel): AgentMessage {
    return {
      id: agent._id.toHexString(),
      createdAt: agent.createdAt.toISOString(),
      updatedAt: agent.updatedAt.toISOString(),
      account: agent.account.toHexString(),
      email: agent.email,
      phone: agent.phone,
      firstName: agent.firstName,
      lastName: agent.lastName,
      title: agent.title,
      role: AgentRole[agent.role],
      password: agent.password,
      refreshToken: agent.refreshToken,
    };
  }
}
