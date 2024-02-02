import {
  AgentRole,
  ChannelsMessageResponse,
  ParseMongoIdPipe,
  Roles,
} from '@app/common';
import {
  Controller,
  Get,
  Param,
  Req,
  UseGuards,
  Post,
  Body,
  Patch,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs/internal/Observable';
import { CreateChannelDto } from '../../dto/channel/create-channel.dto';
import { UpdateChannelAgentsDto } from '../../dto/channel/update-channel-agents.dto';
import { AccessTokenGuard } from '../../guards/access-token.guard';
import { JwtPayloadDto } from '../../dto/auth/jwt-payload.dto';
import { ChannelService } from '../../services/cahnnel.service';

@Controller('channel')
export class ChannelHttpController {
  constructor(private readonly channelService: ChannelService) {}

  @UseGuards(AccessTokenGuard)
  @Roles(AgentRole.OWNER)
  @Post()
  async create(
    @Req() req: Request,
    @Body() dto: CreateChannelDto,
  ): Promise<void> {
    const jwtPaylaod = req['user'] as JwtPayloadDto;
    await this.channelService.create(jwtPaylaod, dto);
  }

  @UseGuards(AccessTokenGuard)
  @Roles(AgentRole.OWNER, AgentRole.ADMIN)
  @Get()
  getAccountChannels(@Req() req: Request): Observable<ChannelsMessageResponse> {
    const jwtPayload = req['user'] as JwtPayloadDto;
    return this.channelService.getAccountChannels(jwtPayload);
  }

  @UseGuards(AccessTokenGuard)
  @Roles(AgentRole.OWNER, AgentRole.ADMIN)
  @Get(':id')
  async getChannelById(@Req() req: Request, @Param('id') channelId: string) {
    const jwtPayload = req['user'] as JwtPayloadDto;
    return this.channelService.getById(jwtPayload, channelId);
  }

  @UseGuards(AccessTokenGuard)
  @Roles(AgentRole.OWNER, AgentRole.ADMIN)
  @Patch(':id/agents')
  async updateChannelAgents(
    @Req() req: Request,
    @Param('id', ParseMongoIdPipe) channelId: string,
    @Body() dto: UpdateChannelAgentsDto,
  ) {
    const jwtPaylaod = req['user'] as JwtPayloadDto;
    await this.channelService.updateAgents(jwtPaylaod, channelId, dto);
  }
}
