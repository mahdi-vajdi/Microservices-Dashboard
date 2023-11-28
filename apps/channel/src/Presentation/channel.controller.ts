import { CommonAccessTokenGuard, JwtPayload } from '@app/common';
import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateChannelCommand } from '../Application/commands/impl/create-channel.command';
import { CreateChannelDto } from '../Application/dto/request/create-channel.dto';
import { GetByIdQuery } from '../Application/queries/impl/get-by-id.query';
import { ChannelModel } from '../Infrastructure/models/channel.model';
import { GetUserChannelsQuery } from '../Application/queries/impl/get-user-cahnnels.query';
import { ParseMongoIdPipe } from '@app/common/pipes/parse-objectId.pipe';

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
      new CreateChannelCommand(user.sub, dto),
    );
  }

  @UseGuards(CommonAccessTokenGuard)
  @Get()
  async getUserChannels(@Req() req: Request) {
    const user = req['user'] as JwtPayload;

    return await this.queryBus.execute<
      GetUserChannelsQuery,
      ChannelModel[] | null
    >(new GetUserChannelsQuery(user.sub));
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
        `Could not find a channel for user with id ${channelId}`,
      );

    return channel;
  }
}
