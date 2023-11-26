import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetByAdminQuery } from '../impl/get-by-admin.query';
import { AgentModel } from 'apps/agent/src/Infrastructure/models/agent.model';
import { AgentReadRepository } from 'apps/agent/src/Infrastructure/repositories/agent-read.repo';

@QueryHandler(GetByAdminQuery)
export class GetByAdminHandler
  implements IQueryHandler<GetByAdminQuery, AgentModel[]>
{
  constructor(private readonly agentRepo: AgentReadRepository) {}

  async execute(query: GetByAdminQuery): Promise<AgentModel[]> {
    return this.agentRepo.findByAdmin(query.adminId);
  }
}
