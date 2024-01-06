import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateChannelCommand } from '../impl/create-channel.command';
import { Inject, OnModuleInit } from '@nestjs/common';
import { AgentServiceClient, GRPC_AGENT } from '@app/common';
import { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { Types } from 'mongoose';
import { ChannelEntityRepository } from 'apps/channel/src/Domain/base-channel.repo';
import { Channel } from 'apps/channel/src/Domain/entities/channel.entity';

@CommandHandler(CreateChannelCommand)
export class CreateChannelHandler
  implements OnModuleInit, ICommandHandler<CreateChannelCommand, void>
{
  private agentQueryService: AgentServiceClient;

  constructor(
    @Inject(GRPC_AGENT) private readonly agentGrpcClient: ClientGrpc,
    private readonly channelRepo: ChannelEntityRepository,
  ) {}

  onModuleInit() {
    this.agentQueryService =
      this.agentGrpcClient.getService<AgentServiceClient>('AgentService');
  }

  async execute({ dto }: CreateChannelCommand): Promise<void> {
    let agents: string[] = [];
    // get agents ids if caller wants
    if (dto.addAllAgents) {
      const { agentsIds } = await lastValueFrom(
        this.agentQueryService.getAgentsIds({
          accountId: dto.accountId,
        }),
      );
      if (agentsIds) agents = agentsIds;
    }

    const channel = Channel.create(
      new Types.ObjectId().toHexString(),
      dto.accountId,
      dto.title,
      dto.url,
      crypto.randomUUID(),
      agents,
    );

    await this.channelRepo.add(channel);
    channel.commit();
  }
}
