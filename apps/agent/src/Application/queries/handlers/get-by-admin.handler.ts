import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUserAgents } from '../impl/get-user-agents.query';
import { AgentModel } from 'apps/agent/src/Infrastructure/models/agent.model';
import { AgentQueryepository } from 'apps/agent/src/Infrastructure/repositories/agent.query-repo';

@QueryHandler(GetUserAgents)
export class GetUserAgentsHandler
  implements IQueryHandler<GetUserAgents, AgentModel[]>
{
  constructor(private readonly agentRepo: AgentQueryepository) {}

  async execute(query: GetUserAgents): Promise<AgentModel[]> {
    return this.agentRepo.findByAdmin(query.adminId);
  }
}
