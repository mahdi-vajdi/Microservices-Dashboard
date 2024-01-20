import { Controller } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  Ctx,
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
import { NatsJetStreamContext } from '@nestjs-plugins/nestjs-nats-jetstream-transport';

/**
 * The controller that handles commands via nats
 *
 * @export
 * @class AgentNatsController
 * @typedef {AgentNatsController}
 */
@Controller()
export class AgentNatsController {
  constructor(private readonly commandBus: CommandBus) {}

  @MessagePattern({ cmd: AgentSubjects.CREATE_OWNER_AGENT })
  async createOwnerAgent(@Payload() dto: CreateOwnerAgentDto): Promise<void> {
    await this.commandBus.execute<CreateOwnerAgentCommand, void>(
      new CreateOwnerAgentCommand(dto),
    );
  }

  @MessagePattern({ cmd: AgentSubjects.CREATE_AGENT })
  async createAgent(@Payload() dto: CreateAgentDto) {
    try {
      await this.commandBus.execute<CreateAgentCommand, boolean>(
        new CreateAgentCommand(dto),
      );
      return null; // null means operation was successfull
    } catch (error) {
      throw new RpcException({
        statusCode: 409,
        message: 'Agent already exists',
      });
    }
  }

  @EventPattern(AgentSubjects.UPDATE_REFRESH_TOKEN)
  async updateRefreshToken(
    @Payload() { agentId: id, newToken: token }: UpdateRefreshTokenDto,
    @Ctx() context: NatsJetStreamContext,
  ): Promise<void> {
    await this.commandBus.execute<UpdateRefreshTokenCommand, void>(
      new UpdateRefreshTokenCommand(id, token),
    );
    context.message.ack();
  }
}
