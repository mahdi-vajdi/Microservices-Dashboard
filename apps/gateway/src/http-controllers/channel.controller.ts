import {
  AgentRole,
  CHANNEL_SERVICE,
  ChannelServiceClient,
  ChannelsMessageResponse,
  CommonAccessTokenGuard,
  JwtPayloadDto,
  ParseMongoIdPipe,
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
  Post,
  Body,
  Patch,
} from '@nestjs/common';
import { ClientGrpc, ClientProxy } from '@nestjs/microservices';
import { Request } from 'express';
import { Observable } from 'rxjs/internal/Observable';
import { CreateChannelDto } from '../dto/channel/create-channel.dto';
import { lastValueFrom } from 'rxjs';
import { UpdateChannelAgentsDto } from '../dto/channel/update-channel-agents.dto';

@Controller('channel')
export class ChannelHttpController implements OnModuleInit {
  queryService: ChannelServiceClient;

  constructor(
    @Inject('CHANNEL_GPRC') private readonly grpcClient: ClientGrpc,
    @Inject(CHANNEL_SERVICE) private readonly commandService: ClientProxy,
  ) {}

  onModuleInit() {
    this.queryService =
      this.grpcClient.getService<ChannelServiceClient>('ChannelService');
  }

  @UseGuards(CommonAccessTokenGuard)
  @Roles(AgentRole.OWNER, AgentRole.ADMIN)
  @Get()
  getAccountChannels(@Req() req: Request): Observable<ChannelsMessageResponse> {
    const jwtPayload = req['user'] as JwtPayloadDto;

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

  @UseGuards(CommonAccessTokenGuard)
  @Roles(AgentRole.OWNER)
  @Post()
  async create(
    @Req() req: Request,
    @Body() dto: CreateChannelDto,
  ): Promise<void> {
    const jwtPaylaod = req['user'] as JwtPayloadDto;
    await lastValueFrom(
      this.commandService.emit<void>('createChannel', {
        accountId: jwtPaylaod.account,
        ...dto,
      }),
    );
  }

  @UseGuards(CommonAccessTokenGuard)
  @Roles(AgentRole.OWNER, AgentRole.ADMIN)
  @Patch(':id/agents')
  async updateChannelAgents(
    @Req() req: Request,
    @Param('id', ParseMongoIdPipe) channelId: string,
    @Body() dto: UpdateChannelAgentsDto,
  ) {
    const jwtPaylaod = req['user'] as JwtPayloadDto;
    await lastValueFrom(
      this.commandService.emit<void>('updateChannelAgents', {
        requesterAccountId: jwtPaylaod.account,
        channelId,
        ...dto,
      }),
    );
  }
}
