import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateChannelAgentsCommand } from '../impl/update-channel-agents';
import { ChannelEntityRepository } from 'apps/channel/src/Domain/base-channel.repo';

@CommandHandler(UpdateChannelAgentsCommand)
export class UpdateChannelAgentsHandler
  implements ICommandHandler<UpdateChannelAgentsCommand, boolean>
{
  constructor(private readonly channelRepo: ChannelEntityRepository) {}

  async execute(command: UpdateChannelAgentsCommand): Promise<boolean> {
    try {
      const channel = await this.channelRepo.findById(command.channelId);

      if (!channel || channel.account !== command.accountId) return false;

      if (channel && channel.account === command.accountId)
        channel.updateAgents(command.agentIds);

      await this.channelRepo.save(channel);
      channel.commit();
      return true;
    } catch (error) {
      return false;
    }
  }
}
