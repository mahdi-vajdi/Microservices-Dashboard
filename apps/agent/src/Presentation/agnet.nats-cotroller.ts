import { Controller } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { GetAgentIdsDto } from '../Application/dto/get-agents-ids.dto';
import { GetUserAgentsIdsQuery } from '../Application/queries/impl/get-user-agents-ids.query';
import { CreateAgentCommand } from '../Application/commands/impl/create-agent.command';
import { NatsCreateAgentDto } from '../Application/dto/nats-create-agent.dto';

@Controller()
export class AgentNatsController {
  constructor(
    private readonly commandBud: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @MessagePattern('getAgentsIds')
  async getAgnetsIds(@Payload() { id }: GetAgentIdsDto): Promise<string[]> {
    return await this.queryBus.execute<GetUserAgentsIdsQuery, string[]>(
      new GetUserAgentsIdsQuery(id),
    );
  }

  @EventPattern('createAgent')
  async createAgent(@Payload() dto: NatsCreateAgentDto): Promise<void> {
    await this.commandBud.execute<CreateAgentCommand, void>(
      new CreateAgentCommand(dto.userId, dto),
    );
  }
}
