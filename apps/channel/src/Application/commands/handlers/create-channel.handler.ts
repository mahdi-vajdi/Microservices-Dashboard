import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateChannelCommand } from '../impl/create-channel.command';
import { Types } from 'mongoose';
import { ChannelEntityRepository } from 'apps/channel/src/Domain/base-channel.repo';
import { Channel } from 'apps/channel/src/Domain/entities/channel.entity';

@CommandHandler(CreateChannelCommand)
export class CreateChannelHandler
  implements ICommandHandler<CreateChannelCommand, void>
{
  constructor(private readonly channelRepo: ChannelEntityRepository) {}

  async execute(command: CreateChannelCommand): Promise<void> {
    try {
      const channel = Channel.create(
        new Types.ObjectId().toHexString(),
        command.accountId,
        command.title,
        command.url,
        command.token,
        command.agents,
      );

      await this.channelRepo.add(channel);
      channel.commit();
    } catch (error) {
      throw new Error(error);
    }
  }
}
