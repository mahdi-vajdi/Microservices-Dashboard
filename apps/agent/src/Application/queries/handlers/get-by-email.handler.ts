import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetByEmailQuery } from '../impl/get-by-email.query';
import { AgentDto } from '@app/common';
import { AgentQueryRepository } from 'apps/agent/src/Infrastructure/repositories/agent.query-repo';

@QueryHandler(GetByEmailQuery)
export class GetByEmailHandler
  implements IQueryHandler<GetByEmailQuery, AgentDto | null>
{
  constructor(private readonly agentRepo: AgentQueryRepository) {}

  async execute({ email }: GetByEmailQuery): Promise<AgentDto | null> {
    return this.agentRepo.findByEmail(email);
  }
}
