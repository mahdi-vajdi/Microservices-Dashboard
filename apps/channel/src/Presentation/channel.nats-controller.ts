import { Controller } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateChannelCommand } from '../Application/commands/impl/create-channel.command';
import { CreateChannelDto } from '../Application/dto/create-channel.dto';
import { UpdateChannelAgentsCommand } from '../Application/commands/impl/update-channel-agents';
import { UpdateChannelAgentsDto } from '../Application/dto/update-channel-agents.dto';
import { Ctx, EventPattern, Payload } from '@nestjs/microservices';
import { ChannelSubjects } from '@app/common';
import { NatsJetStreamContext } from '@nestjs-plugins/nestjs-nats-jetstream-transport';

@Controller()
export class ChannelNatsController {
  constructor(private readonly commandBus: CommandBus) {}

  @EventPattern(ChannelSubjects.CREATE_CHANNEL)
  async create(
    @Payload() dto: CreateChannelDto,
    @Ctx() context: NatsJetStreamContext,
  ): Promise<void> {
    await this.commandBus.execute<CreateChannelCommand, void>(
      new CreateChannelCommand(dto),
    );
    context.message.ack();
  }

  @EventPattern(ChannelSubjects.UPDATE_CHANNEL_AGENTS)
  async updateChannelAgents(
    @Payload() dto: UpdateChannelAgentsDto,
    @Ctx() context: NatsJetStreamContext,
  ): Promise<void> {
    await this.commandBus.execute<UpdateChannelAgentsCommand, void>(
      new UpdateChannelAgentsCommand(
        dto.requesterAccountId,
        dto.channelId,
        dto.agents,
      ),
    );
    context.message.ack();
  }
}
