import { CommonAccessTokenGuard, JwtPayload } from '@app/common';
import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateChannelCommand } from '../Application/commands/impl/create-channel.command';
import { CreateChannelDto } from '../Application/dto/request/create-channel.dto';
import { GetByIdQuery } from '../Application/queries/impl/get-by-id.query';
import { ChannelModel } from '../Infrastructure/models/channel.model';
import { GetAccountChannelsQuery } from '../Application/queries/impl/get-account-cahnnels.query';
import { ParseMongoIdPipe } from '@app/common/pipes/parse-objectId.pipe';
import { UpdateChannelAgentsCommand } from '../Application/commands/impl/update-channel-agents';
import { UpdateChannelAgentsDto } from '../Application/dto/request/update-channel-agents.dto';

@Controller('channel')
export class ChannelController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @UseGuards(CommonAccessTokenGuard)
  @Post()
  async create(
    @Req() req: Request,
    @Body() dto: CreateChannelDto,
  ): Promise<void> {
    const user = req['user'] as JwtPayload;
    await this.commandBus.execute<CreateChannelCommand, void>(
      new CreateChannelCommand(user.account, dto),
    );
  }

  @UseGuards(CommonAccessTokenGuard)
  @Get()
  async getAccountChannels(@Req() req: Request) {
    const user = req['user'] as JwtPayload;

    return await this.queryBus.execute<
      GetAccountChannelsQuery,
      ChannelModel[] | null
    >(new GetAccountChannelsQuery(user.account));
  }

  @UseGuards(CommonAccessTokenGuard)
  @Get(':id')
  async getById(
    @Req() req: Request,
    @Param('id', ParseMongoIdPipe) channelId: string,
  ): Promise<ChannelModel> {
    const user = req['user'] as JwtPayload;
    const channel = await this.queryBus.execute<GetByIdQuery, ChannelModel>(
      new GetByIdQuery(user.sub, channelId),
    );

    if (!channel)
      throw new NotFoundException(
        `Could not find a channel for account with id ${channelId}`,
      );

    return channel;
  }

  @UseGuards(CommonAccessTokenGuard)
  @Patch(':id/agents')
  async updateChannelAgents(
    @Req() req: Request,
    @Param('id', ParseMongoIdPipe) channelId: string,
    @Body() { agents }: UpdateChannelAgentsDto,
  ) {
    const user = req['user'] as JwtPayload;
    await this.commandBus.execute<UpdateChannelAgentsCommand, void>(
      new UpdateChannelAgentsCommand(user.sub, channelId, agents),
    );
  }
}
