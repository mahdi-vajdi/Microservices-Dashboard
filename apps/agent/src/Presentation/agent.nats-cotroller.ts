import { Controller } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  EventPattern,
  MessagePattern,
  Payload,
  RpcException,
} from '@nestjs/microservices';
import { UpdateRefreshTokenDto } from '../Application/dto/update-refresh-token.dto';
import { UpdateRefreshTokenCommand } from '../Application/commands/impl/update-refresh-token.command';
import { CreateOwnerAgentDto } from '../Application/dto/create-owner-agent.dto';
import { CreateOwnerAgentCommand } from '../Application/commands/impl/create-owner-agent.command';
import { CreateAgentCommand } from '../Application/commands/impl/create-agent.command';
import { CreateAgentDto } from '../Application/dto/create-agent.dto';
import { AgentSubjects } from '@app/common';

@Controller()
export class AgentNatsController {
  constructor(private readonly commandBus: CommandBus) {}

  @MessagePattern(AgentSubjects.CREATE_OWNER_AGENT)
  async createOwnerAgent(@Payload() dto: CreateOwnerAgentDto): Promise<void> {
    await this.commandBus.execute<CreateOwnerAgentCommand, void>(
      new CreateOwnerAgentCommand(dto),
    );
  }

  @MessagePattern(AgentSubjects.CREATE_AGENT)
  async createAgent(@Payload() dto: CreateAgentDto): Promise<void> {
    try {
      await this.commandBus.execute<CreateAgentCommand, void>(
        new CreateAgentCommand(dto),
      );
    } catch (error) {
      throw new RpcException({
        statusCode: 409,
        message: 'Agent phone/email is duplicate.',
      });
    }
  }

  @EventPattern(AgentSubjects.UPDATE_REFRESH_TOKEN)
  async updateRefreshToken(
    @Payload() { agentId: id, newToken: token }: UpdateRefreshTokenDto,
  ): Promise<void> {
    await this.commandBus.execute<UpdateRefreshTokenCommand, void>(
      new UpdateRefreshTokenCommand(id, token),
    );
  }
}
