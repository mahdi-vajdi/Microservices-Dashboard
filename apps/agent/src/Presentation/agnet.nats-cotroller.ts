import { Controller } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { GetAgentIdsDto } from '../Application/dto/get-agents-ids.dto';
import { GetUserAgentsIdsQuery } from '../Application/queries/impl/get-user-agents-ids.query';

@Controller()
export class AgentNatsController {
  constructor(private readonly queryBus: QueryBus) {}

  @MessagePattern('getAgentsIds')
  async getAgnetsIds(@Payload() { id }: GetAgentIdsDto): Promise<string[]> {
    return await this.queryBus.execute<GetUserAgentsIdsQuery, string[]>(
      new GetUserAgentsIdsQuery(id),
    );
  }
}
