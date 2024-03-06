import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateOwnerAgentDto } from '../dto/create-owner-agent.dto';
import { UpdateRefreshTokenDto } from '../dto/update-refresh-token.dto';
import { UpdateRefreshTokenCommand } from '../commands/impl/update-refresh-token.command';
import { CreateAgentCommand } from '../commands/impl/create-agent.command';
import { CreateAgentDto } from '../dto/create-agent.dto';
import { AgentExistsQuery } from '../queries/impl/agent-exists-query';
import { AgentRole, ApiResponse } from '@app/common';
import { GetByEmailQuery } from '../queries/impl/get-by-email.query';
import { ChannelModel } from 'apps/channel/src/Infrastructure/models/channel.model';

@Injectable()
export class AgentService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  async createOwnerAgent(
    dto: CreateOwnerAgentDto,
  ): Promise<ApiResponse<ChannelModel>> {
    try {
      // Check if the agent already exists
      const agentExists = await this.queryBus.execute(
        new AgentExistsQuery(dto.email, dto.phone),
      );
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

      const createdAgent = await this.queryBus.execute(
        new GetByEmailQuery(dto.email),
      );

      return {
        success: true,
        data: createdAgent,
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

  async createAgent(dto: CreateAgentDto): Promise<ApiResponse<ChannelModel>> {
    try {
      // Check if the agent already exists
      const agentExists = await this.queryBus.execute(
        new AgentExistsQuery(dto.email, dto.phone),
      );
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

      const createdAgent = await this.queryBus.execute(
        new GetByEmailQuery(dto.email),
      );

      return {
        success: true,
        data: createdAgent,
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
}
