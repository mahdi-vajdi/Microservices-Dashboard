import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { UpdateRefreshTokenDto } from '../Application/dto/update-refresh-token.dto';
import { CreateOwnerAgentDto } from '../Application/dto/create-owner-agent.dto';
import { CreateAgentDto } from '../Application/dto/create-agent.dto';
import { AgentSubjects, ApiResponse } from '@app/common';
import { AgentService } from '../Application/services/agent.service';
import { AgentModel } from '../Infrastructure/models/agent.model';

/**
 * The controller that handles commands via NATS
 */
@Controller()
export class AgentNatsController {
  constructor(private readonly agentService: AgentService) {}

  @MessagePattern({ cmd: AgentSubjects.CREATE_OWNER_AGENT })
  async createOwnerAgent(
    @Payload() dto: CreateOwnerAgentDto,
  ): Promise<ApiResponse<AgentModel | null>> {
    return await this.agentService.createOwnerAgent(dto);
  }

  @MessagePattern({ cmd: AgentSubjects.CREATE_AGENT })
  async createAgent(
    @Payload() dto: CreateAgentDto,
  ): Promise<ApiResponse<AgentModel | null>> {
    return await this.agentService.createAgent(dto);
  }

  @EventPattern(AgentSubjects.UPDATE_REFRESH_TOKEN)
  async updateRefreshToken(
    @Payload() dto: UpdateRefreshTokenDto,
  ): Promise<ApiResponse<null>> {
    return await this.agentService.updateRefreshToken(dto);
  }
}
