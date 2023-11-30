import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUserAgentsIdsQuery } from '../impl/get-user-agents-ids.query';
import { AgentQueryepository } from 'apps/agent/src/Infrastructure/repositories/agent.query-repo';

@QueryHandler(GetUserAgentsIdsQuery)
export class GetUserAgentsIdsHandler
  implements IQueryHandler<GetUserAgentsIdsQuery, string[]>
{
  constructor(private readonly agentRepo: AgentQueryepository) {}

  async execute(query: GetUserAgentsIdsQuery): Promise<string[]> {
    return await this.agentRepo.findIdsByAccount(query.accountId);
  }
}
