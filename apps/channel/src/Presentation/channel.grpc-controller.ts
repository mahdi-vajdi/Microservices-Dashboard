import {
  ChannelMessageResponse,
  ChannelsMessageResponse,
  GetAccountChannelsRequest,
  GetChannelByIdRequest,
} from '@app/common';
import { Metadata, ServerUnaryCall } from '@grpc/grpc-js';
import { GrpcMethod } from '@nestjs/microservices';
import { Controller } from '@nestjs/common';
import { ChannelService } from '../Application/services/channel.service';
/**
 * The controller that handler queries from the service via grpc
 *
 * @export
 * @class ChannelGrpcController
 */
@Controller()
export class ChannelGrpcController {
  constructor(private readonly channelService: ChannelService) {}

  @GrpcMethod('ChannelService', 'GetAccountChannels')
  async getAccountChannels(
    data: GetAccountChannelsRequest,
    metadata: Metadata,
    call: ServerUnaryCall<any, any>,
  ): Promise<ChannelsMessageResponse> {
    return this.channelService.getAccountChannels(data.accountId);
  }

  @GrpcMethod('ChannelService', 'GetChannelById')
  async getById(
    data: GetChannelByIdRequest,
    metadata: Metadata,
    call: ServerUnaryCall<any, any>,
  ): Promise<ChannelMessageResponse> {
    return this.channelService.getById(data.accountId, data.channelId);
  }
}
