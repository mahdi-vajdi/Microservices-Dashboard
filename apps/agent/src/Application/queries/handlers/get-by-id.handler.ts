import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetByIdQuery } from '../impl/get-by-id.query';
import { AgentDto } from '@app/common';
import { AgentQueryepository } from 'apps/agent/src/Infrastructure/repositories/agent.query-repo';

@QueryHandler(GetByIdQuery)
export class GetByIdHandler
  implements IQueryHandler<GetByIdQuery, AgentDto | null>
{
  constructor(private readonly agentRepo: AgentQueryepository) {}

  async execute({ agentId }: GetByIdQuery): Promise<AgentDto | null> {
    return this.agentRepo.findById(agentId);
  }
}
