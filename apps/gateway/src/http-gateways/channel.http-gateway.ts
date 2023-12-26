import {
  AgentRole,
  ChannelServiceClient,
  ChannelsMessageResponse,
  CommonAccessTokenGuard,
  JwtPayloadDto,
  Roles,
} from '@app/common';
import {
  Controller,
  Get,
  Inject,
  OnModuleInit,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Request } from 'express';
import { Observable } from 'rxjs/internal/Observable';

@Controller('channel')
export class ChannelHttpGateway implements OnModuleInit {
  queryService: ChannelServiceClient;

  constructor(
    @Inject('CHANNEL_GPRC') private readonly grpcClient: ClientGrpc,
  ) {}

  onModuleInit() {
    console.log('client: ', this.grpcClient);
    this.queryService =
      this.grpcClient.getService<ChannelServiceClient>('ChannelService');
    console.log('query  service: ', this.queryService);
  }

  @UseGuards(CommonAccessTokenGuard)
  @Roles(AgentRole.OWNER, AgentRole.ADMIN)
  @Get()
  getAccountChannels(@Req() req: Request): Observable<ChannelsMessageResponse> {
    const jwtPayload = req['user'] as JwtPayloadDto;

    console.log('agent account', jwtPayload.account);
    return this.queryService.GetAccountChannels({
      accountId: jwtPayload.account,
    });
  }

  @UseGuards(CommonAccessTokenGuard)
  @Roles(AgentRole.OWNER, AgentRole.ADMIN)
  @Get(':id')
  async getChannelById(@Req() req: Request, @Param('id') channelId: string) {
    const jwtPayload = req['user'] as JwtPayloadDto;

    return this.queryService.GetChannelById({
      userId: jwtPayload.sub,
      channelId: channelId,
    });
  }
}
