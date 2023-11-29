import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { AgentExistsQuery } from '../impl/agent-exists-query';
import { AgentQueryepository } from 'apps/agent/src/Infrastructure/repositories/agent.query-repo';

@QueryHandler(AgentExistsQuery)
export class AgentExistsHandler
  implements IQueryHandler<AgentExistsQuery, boolean>
{
  constructor(private readonly agentRepo: AgentQueryepository) {}

  async execute(query: any): Promise<boolean> {
    const exists = await this.agentRepo.agentExists(query.email, query.phone);
    if (exists) return true;
    else return false;
  }
}
