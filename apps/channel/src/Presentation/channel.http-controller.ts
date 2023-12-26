import {
  AgentRole,
  CommonAccessTokenGuard,
  JwtPayloadDto,
  Roles,
} from '@app/common';
import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateChannelCommand } from '../Application/commands/impl/create-channel.command';
import { CreateChannelDto } from '../Application/dto/request/create-channel.dto';
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
  @Roles(AgentRole.OWNER)
  @Post()
  async create(
    @Req() req: Request,
    @Body() dto: CreateChannelDto,
  ): Promise<void> {
    const user = req['user'] as JwtPayloadDto;
    await this.commandBus.execute<CreateChannelCommand, void>(
      new CreateChannelCommand(user.account, dto),
    );
  }

  @UseGuards(CommonAccessTokenGuard)
  @Roles(AgentRole.OWNER, AgentRole.ADMIN)
  @Patch(':id/agents')
  async updateChannelAgents(
    @Req() req: Request,
    @Param('id', ParseMongoIdPipe) channelId: string,
    @Body() { agents }: UpdateChannelAgentsDto,
  ) {
    const user = req['user'] as JwtPayloadDto;
    await this.commandBus.execute<UpdateChannelAgentsCommand, void>(
      new UpdateChannelAgentsCommand(user.sub, channelId, agents),
    );
  }
}
