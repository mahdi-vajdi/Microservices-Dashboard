import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetByIdQuery } from '../impl/get-by-id.query';
import { AgentQueryRepository } from 'apps/agent/src/Infrastructure/repositories/agent.query-repo';
import { AgentModel } from 'apps/agent/src/Infrastructure/models/agent.model';

@QueryHandler(GetByIdQuery)
export class GetByIdHandler
  implements IQueryHandler<GetByIdQuery, AgentModel | null>
{
  constructor(private readonly agentRepo: AgentQueryRepository) {}

  async execute({ agentId }: GetByIdQuery): Promise<AgentModel | null> {
    return this.agentRepo.findById(agentId);
  }
}
