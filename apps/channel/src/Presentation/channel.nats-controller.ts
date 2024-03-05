import { Controller } from '@nestjs/common';
import { CreateChannelDto } from '../Application/dto/create-channel.dto';
import { UpdateChannelAgentsDto } from '../Application/dto/update-channel-agents.dto';
import { EventPattern, Payload } from '@nestjs/microservices';
import { ChannelSubjects } from '@app/common';
import { ChannelService } from '../Application/services/channel.service';
import { ChannelModel } from '../Infrastructure/models/channel.model';

/**
 * The controller that handler commands to the service via nats
 *
 * @export
 * @class ChannelNatsController
 * @typedef {ChannelNatsController}
 */
@Controller()
export class ChannelNatsController {
  constructor(private readonly channelService: ChannelService) {}

  @EventPattern(ChannelSubjects.CREATE_CHANNEL)
  async create(@Payload() dto: CreateChannelDto): Promise<ChannelModel | null> {
    return await this.channelService.create(dto);
  }

  @EventPattern(ChannelSubjects.UPDATE_CHANNEL_AGENTS)
  async updateChannelAgents(
    @Payload() dto: UpdateChannelAgentsDto,
  ): Promise<boolean> {
    return await this.channelService.updateAgentsList(dto);
  }
}
