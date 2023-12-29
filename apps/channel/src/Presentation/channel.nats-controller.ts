import { Controller } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateChannelCommand } from '../Application/commands/impl/create-channel.command';
import { CreateChannelDto } from '../Application/dto/request/create-channel.dto';
import { UpdateChannelAgentsCommand } from '../Application/commands/impl/update-channel-agents';
import { UpdateChannelAgentsDto } from '../Application/dto/request/update-channel-agents.dto';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class ChannelNatsController {
  constructor(private readonly commandBus: CommandBus) {}

  @EventPattern('createChannel')
  async create(@Payload() dto: CreateChannelDto): Promise<void> {
    await this.commandBus.execute<CreateChannelCommand, void>(
      new CreateChannelCommand(dto),
    );
  }

  @EventPattern('updateChannelAgents')
  async updateChannelAgents(
    @Payload() dto: UpdateChannelAgentsDto,
  ): Promise<void> {
    await this.commandBus.execute<UpdateChannelAgentsCommand, void>(
      new UpdateChannelAgentsCommand(
        dto.requesterAccountId,
        dto.channelId,
        dto.agents,
      ),
    );
  }
}
