import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateAgentCommand } from '../impl/create-agent.command';
import { AgentEntityRepository } from 'apps/agent/src/Domain/base-agent.entity-repo';
import { Agent } from 'apps/agent/src/Domain/entities/agent.entity';
import { Types } from 'mongoose';
import { AgentQueryRepository } from 'apps/agent/src/Infrastructure/repositories/agent.query-repo';
import * as bcrypt from 'bcryptjs';

@CommandHandler(CreateAgentCommand)
export class CreateAgentHandler
  implements ICommandHandler<CreateAgentCommand, void | null>
{
  constructor(
    private readonly agentEntityRepo: AgentEntityRepository,
    private readonly agentQueryRepo: AgentQueryRepository,
  ) {}

  async execute({ dto }: CreateAgentCommand): Promise<void> {
    // Check if agent info are duplicate; null means duplicate
    if (await this.agentQueryRepo.agentExists(dto.email, dto.phone))
      throw new Error('Agent is duplicate');

    const agent = Agent.create(
      new Types.ObjectId().toHexString(),
      dto.requesterAccountId,
      dto.email,
      dto.phone,
      dto.firstName,
      dto.lastName,
      dto.title,
      await bcrypt.hash(dto.password, 10),
      null,
      dto.role,
      'default',
    );
    console.log('agent entity: ', agent);

    await this.agentEntityRepo.add(agent);
    agent.commit();
    return;
  }
}
