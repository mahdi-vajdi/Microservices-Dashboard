import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateChannelDto } from '../dto/create-channel.dto';
import { CreateChannelCommand } from '../commands/impl/create-channel.command';
import { lastValueFrom } from 'rxjs';
import { AgentServiceClient, GRPC_AGENT } from '@app/common';
import { ClientGrpc } from '@nestjs/microservices';
import { GetChannelByIdQuery } from '../queries/impl/get-by-id.query';
import { ChannelModel } from '../../Infrastructure/models/channel.model';
import { UpdateChannelAgentsDto } from '../dto/update-channel-agents.dto';
import { UpdateChannelAgentsCommand } from '../commands/impl/update-channel-agents';

@Injectable()
export class ChannelService implements OnModuleInit {
  private readonly logger = new Logger(ChannelService.name);
  private agentQueryService: AgentServiceClient;

  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    @Inject(GRPC_AGENT) private readonly agentGrpcClient: ClientGrpc,
  ) {}

  onModuleInit() {
    this.agentQueryService =
      this.agentGrpcClient.getService<AgentServiceClient>('AgentService');
  }

  async create(dto: CreateChannelDto): Promise<ChannelModel | null> {
    try {
      // Get agents ids if caller wants
      const agents: string[] = [];
      if (dto.addAllAgents) {
        const { agentsIds } = await lastValueFrom(
          this.agentQueryService.getAgentsIds({
            accountId: dto.accountId,
          }),
        );
        if (agentsIds) agents.push(...agentsIds);
      }

      const channelId = await this.commandBus.execute<
        CreateChannelCommand,
        string
      >(
        new CreateChannelCommand(
          dto.accountId,
          dto.title,
          dto.url,
          crypto.randomUUID(),
          agents,
        ),
      );

      const channel = await this.queryBus.execute<
        GetChannelByIdQuery,
        ChannelModel | null
      >(new GetChannelByIdQuery(dto.accountId, channelId));

      return channel;
    } catch (error) {
      this.logger.error(error.message, {
        function: 'create',
        date: new Date(),
        data: dto,
      });
      return null;
    }
  }

  async updateAgentsList(dto: UpdateChannelAgentsDto): Promise<boolean> {
    return await this.commandBus.execute<UpdateChannelAgentsCommand, boolean>(
      new UpdateChannelAgentsCommand(
        dto.requesterAccountId,
        dto.channelId,
        dto.agents,
      ),
    );
  }
}
