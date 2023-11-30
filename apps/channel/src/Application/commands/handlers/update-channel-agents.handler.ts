import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateChannelAgentsCommand } from '../impl/update-channel-agents';
import { ChannelEntityRepository } from 'apps/channel/src/Domain/base-channel.repo';

@CommandHandler(UpdateChannelAgentsCommand)
export class UpdateChannelAgentsHandler
  implements ICommandHandler<UpdateChannelAgentsCommand, void>
{
  constructor(private readonly channelRepo: ChannelEntityRepository) {}

  async execute(command: UpdateChannelAgentsCommand): Promise<void> {
    const channel = await this.channelRepo.findById(command.channelId);

    if (!channel || channel.account !== command.userId) return;

    if (channel && channel.account === command.userId) {
      channel.updateAgents(command.agentIds);
    }

    await this.channelRepo.save(channel);
    channel.commit();
  }
}
