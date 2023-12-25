import {
  ChannelMessageResponse,
  ChannelsMessageResponse,
  GetAccountByEmailRequest,
  GetAccountChannelsRequest,
  GetChannelByIdRequest,
} from '@app/common';
import { Metadata, ServerUnaryCall } from '@grpc/grpc-js';
import { QueryBus } from '@nestjs/cqrs';
import { GrpcMethod } from '@nestjs/microservices';
import { ChannelModel } from '../Infrastructure/models/channel.model';
import { GetAccountChannelsQuery } from '../Application/queries/impl/get-account-cahnnels.query';
import { GetByIdQuery } from '../Application/queries/impl/get-by-id.query';

export class ChannelGrpcController {
  constructor(private readonly queryBus: QueryBus) {}

  // @Roles(AgentRole.OWNER, AgentRole.ADMIN)
  @GrpcMethod('AccountService', 'GetAccountById')
  async getAccountChannels(
    data: GetAccountChannelsRequest,
    metadata: Metadata,
    call: ServerUnaryCall<any, any>,
  ): Promise<ChannelsMessageResponse> {
    const channels = await this.queryBus.execute<
      GetAccountChannelsQuery,
      ChannelModel[] | null
    >(new GetAccountChannelsQuery(data.account_id));

    if (channels) return { channels };
    else return { channels: undefined };
  }

  // @Roles(AgentRole.OWNER, AgentRole.ADMIN)
  @GrpcMethod('AccountService', 'GetAccountByEmail')
  async getById(
    data: GetChannelByIdRequest,
    metadata: Metadata,
    call: ServerUnaryCall<any, any>,
  ): Promise<ChannelMessageResponse> {
    const channel = await this.queryBus.execute<GetByIdQuery, ChannelModel>(
      new GetByIdQuery(data.user_id, data.channel_id),
    );

    if (channel) return { channel };
    else return { channel: undefined };
  }
}
