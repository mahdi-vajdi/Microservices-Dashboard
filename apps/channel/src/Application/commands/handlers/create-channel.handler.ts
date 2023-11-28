import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateChannelCommand } from '../impl/create-channel.command';
import { Inject } from '@nestjs/common';
import { AGENT_SERVICE } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs/internal/lastValueFrom';
import { Types } from 'mongoose';
import { ChannelEntityRepository } from 'apps/channel/src/Domain/base-channel.repo';
import { Channel } from 'apps/channel/src/Domain/entities/channel.entity';

@CommandHandler(CreateChannelCommand)
export class CreateChannelHandler
  implements ICommandHandler<CreateChannelCommand, void>
{
  constructor(
    @Inject(AGENT_SERVICE) private readonly agentService: ClientProxy,
    private readonly channelRepo: ChannelEntityRepository,
  ) {}

  async execute({ id, dto }: CreateChannelCommand): Promise<void> {
    let agents: string[] = [];
    // get agents ids if user wants
    if (dto.addAllAgents) {
      agents = await lastValueFrom(
        this.agentService.send<string[]>('getAgentsIds', { id }),
      );
    }

    const channel = Channel.create(
      new Types.ObjectId().toHexString(),
      id,
      dto.title,
      dto.url,
      crypto.randomUUID(),
      agents,
    );

    await this.channelRepo.add(channel);
    channel.commit();
  }
}
