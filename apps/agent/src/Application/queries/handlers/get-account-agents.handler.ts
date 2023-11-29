import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { AgentModel } from 'apps/agent/src/Infrastructure/models/agent.model';
import { AgentQueryepository } from 'apps/agent/src/Infrastructure/repositories/agent.query-repo';
import { GetAccountAgentsQuery } from '../impl/get-account-agents.query';

@QueryHandler(GetAccountAgentsQuery)
export class GetAccountAgentsHandler
  implements IQueryHandler<GetAccountAgentsQuery, AgentModel[]>
{
  constructor(private readonly agentRepo: AgentQueryepository) {}

  async execute(query: GetAccountAgentsQuery): Promise<AgentModel[]> {
    return this.agentRepo.findByAdmin(query.accountId);
  }
}
