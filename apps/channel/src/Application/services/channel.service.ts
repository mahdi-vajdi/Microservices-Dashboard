import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateChannelDto } from '../dto/create-channel.dto';
import { CreateChannelCommand } from '../commands/impl/create-channel.command';
import { lastValueFrom } from 'rxjs';
import {
  AgentServiceClient,
  ApiResponse,
  ChannelMessage,
  ChannelMessageResponse,
  ChannelsMessageResponse,
  GRPC_AGENT,
} from '@app/common';
import { ClientGrpc } from '@nestjs/microservices';
import { GetChannelByIdQuery } from '../queries/impl/get-by-id.query';
import { ChannelModel } from '../../Infrastructure/models/channel.model';
import { UpdateChannelAgentsDto } from '../dto/update-channel-agents.dto';
import { UpdateChannelAgentsCommand } from '../commands/impl/update-channel-agents';
import { GetAccountChannelsQuery } from '../queries/impl/get-account-cahnnels.query';

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

  async create(
    dto: CreateChannelDto,
  ): Promise<ApiResponse<ChannelModel | null>> {
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

      return {
        success: true,
        data: channel,
      };
    } catch (error) {
      this.logger.error(error.message, {
        function: 'create',
        date: new Date(),
        data: dto,
      });

      return {
        success: false,
        error: {
          code: 500,
          message: error.message,
        },
      };
    }
  }

  async updateAgentsList(
    dto: UpdateChannelAgentsDto,
  ): Promise<ApiResponse<boolean>> {
    try {
      await this.commandBus.execute<UpdateChannelAgentsCommand, boolean>(
        new UpdateChannelAgentsCommand(
          dto.requesterAccountId,
          dto.channelId,
          dto.agents,
        ),
      );

      return {
        success: true,
        data: true,
      };
    } catch (error) {
      this.logger.error(error.message, {
        function: 'updateAgentsList',
        date: new Date(),
        data: dto,
      });

      return {
        success: false,
        error: {
          code: 500,
          message: error.message,
        },
      };
    }
  }
  async getAccountChannels(
    accountId: string,
  ): Promise<ChannelsMessageResponse> {
    const channels = await this.queryBus.execute<
      GetAccountChannelsQuery,
      ChannelModel[] | null
    >(new GetAccountChannelsQuery(accountId));

    if (channels)
      return {
        channels: channels.map((channel) => this.toQueryModel(channel)),
      };
    else return { channels: undefined };
  }

  async getById(
    accountId: string,
    channelId: string,
  ): Promise<ChannelMessageResponse> {
    const channel = await this.queryBus.execute<
      GetChannelByIdQuery,
      ChannelModel
    >(new GetChannelByIdQuery(accountId, channelId));

    if (channel) return { channel: this.toQueryModel(channel) };
    else return { channel: undefined };
  }

  private toQueryModel(channel: ChannelModel): ChannelMessage {
    const { settings } = channel;

    return {
      id: channel._id.toHexString(),
      createdAt: channel.createdAt.toISOString(),
      updatedAt: channel.updatedAt.toISOString(),
      account: channel.account.toHexString(),
      title: channel.title,
      url: channel.url,
      token: channel.token,
      isEnabled: channel.isEnabled,
      agents: channel.agents.map((agent) => agent.toHexString()),
      channelSettings: {
        Main: { ...settings.main, InfoForm: settings.main.infoForm },
        WidgetLandings: settings.widgetLandings,
        WidgetCustomization: settings.widgetCustomization,
        WidgetDisplay: settings.widgetDisplay,
        WidgetPosition: settings.widgetPosition,
      },
    };
  }
}
