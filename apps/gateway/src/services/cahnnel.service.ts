import {
  ChannelServiceClient,
  ChannelSubjects,
  GRPC_CHANNEL,
} from '@app/common';
import { NatsJetStreamClientProxy } from '@nestjs-plugins/nestjs-nats-jetstream-transport';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs/internal/lastValueFrom';
import { JwtPayloadDto } from '../dto/auth/jwt-payload.dto';
import { CreateChannelDto } from '../dto/channel/create-channel.dto';
import { UpdateChannelAgentsDto } from '../dto/channel/update-channel-agents.dto';

@Injectable()
export class ChannelService implements OnModuleInit {
  queryService: ChannelServiceClient;

  constructor(
    @Inject(GRPC_CHANNEL) private readonly grpcClient: ClientGrpc,
    private readonly natsClient: NatsJetStreamClientProxy,
  ) {}

  onModuleInit() {
    this.queryService =
      this.grpcClient.getService<ChannelServiceClient>('ChannelService');
  }

  async create(user: JwtPayloadDto, dto: CreateChannelDto) {
    await lastValueFrom(
      this.natsClient.emit<void>(ChannelSubjects.CREATE_CHANNEL, {
        accountId: user.account,
        ...dto,
      }),
    );
  }

  async updateAgents(
    user: JwtPayloadDto,
    channelId: string,
    dto: UpdateChannelAgentsDto,
  ) {
    await lastValueFrom(
      this.natsClient.emit<void>(ChannelSubjects.UPDATE_CHANNEL_AGENTS, {
        requesterAccountId: user.account,
        channelId,
        ...dto,
      }),
    );
  }

  getById(user: JwtPayloadDto, channelId: string) {
    return this.queryService.getChannelById({
      accountId: user.account,
      channelId: channelId,
    });
  }

  getAccountChannels(user: JwtPayloadDto) {
    return this.queryService.getAccountChannels({
      accountId: user.account,
    });
  }
}
