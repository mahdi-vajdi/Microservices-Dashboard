import { AccessTokenGuard } from '@app/common';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateChannelCommand } from '../Application/commands/impl/create-channel.command';
import { CreateChannelDto } from '../Application/dto/create-channel.dto';
import { GetByIdQuery } from '../Application/queries/impl/get-by-id.query';
import { ChannelModel } from '../Infrastructure/models/channel.model';
import { GetUserChannelsQuery } from '../Application/queries/impl/get-user-cahnnels.query';

@Controller('channel')
export class ChannelController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @UseGuards(AccessTokenGuard)
  @Post()
  async create(@Request() req, @Body() dto: CreateChannelDto): Promise<void> {
    await this.commandBus.execute<CreateChannelCommand, void>(
      new CreateChannelCommand(req.user.sub, dto),
    );
  }

  @UseGuards(AccessTokenGuard)
  @Get(':id')
  async getOne(
    @Request() req,
    @Param('id') channelId: string,
  ): Promise<ChannelModel> {
    return await this.queryBus.execute<GetByIdQuery, ChannelModel>(
      new GetByIdQuery(req.user.id, channelId),
    );
  }

  @UseGuards(AccessTokenGuard)
  async getUserChannels(@Request() req) {
    return await this.queryBus.execute<GetUserChannelsQuery, ChannelModel[]>(
      new GetUserChannelsQuery(req.user.id as string),
    );
  }
}
