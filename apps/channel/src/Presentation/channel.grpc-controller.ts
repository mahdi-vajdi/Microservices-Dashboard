import {
  ChannelMessage,
  ChannelMessageResponse,
  ChannelsMessageResponse,
  GetAccountChannelsRequest,
  GetChannelByIdRequest,
} from '@app/common';
import { Metadata, ServerUnaryCall } from '@grpc/grpc-js';
import { QueryBus } from '@nestjs/cqrs';
import { GrpcMethod } from '@nestjs/microservices';
import { ChannelModel } from '../Infrastructure/models/channel.model';
import { GetAccountChannelsQuery } from '../Application/queries/impl/get-account-cahnnels.query';
import { GetChannelByIdQuery } from '../Application/queries/impl/get-by-id.query';
import { Controller } from '@nestjs/common';
/**
 * The controller that handler queries from the service via grpc
 *
 * @export
 * @class ChannelGrpcController
 * @typedef {ChannelGrpcController}
 */
@Controller()
export class ChannelGrpcController {
  constructor(private readonly queryBus: QueryBus) {}

  @GrpcMethod('ChannelService', 'GetAccountChannels')
  async getAccountChannels(
    data: GetAccountChannelsRequest,
    metadata: Metadata,
    call: ServerUnaryCall<any, any>,
  ): Promise<ChannelsMessageResponse> {
    const channels = await this.queryBus.execute<
      GetAccountChannelsQuery,
      ChannelModel[] | null
    >(new GetAccountChannelsQuery(data.accountId));

    if (channels)
      return { channels: channels.map((channel) => this.toGrpcModel(channel)) };
    else return { channels: undefined };
  }

  @GrpcMethod('ChannelService', 'GetChannelById')
  async getById(
    data: GetChannelByIdRequest,
    metadata: Metadata,
    call: ServerUnaryCall<any, any>,
  ): Promise<ChannelMessageResponse> {
    const channel = await this.queryBus.execute<
      GetChannelByIdQuery,
      ChannelModel
    >(new GetChannelByIdQuery(data.accountId, data.channelId));

    if (channel) return { channel: this.toGrpcModel(channel) };
    else return { channel: undefined };
  }

  private toGrpcModel(channel: ChannelModel): ChannelMessage {
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
