import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAccountAgentsIdsQuery } from '../impl/get-account-agents-ids.query';
import { AgentQueryepository } from 'apps/agent/src/Infrastructure/repositories/agent.query-repo';

@QueryHandler(GetAccountAgentsIdsQuery)
export class GetAccountAgentsIdsHandler
  implements IQueryHandler<GetAccountAgentsIdsQuery, string[]>
{
  constructor(private readonly agentRepo: AgentQueryepository) {}

  async execute(query: GetAccountAgentsIdsQuery): Promise<string[]> {
    return await this.agentRepo.findIdsByAccount(query.accountId);
  }
}
