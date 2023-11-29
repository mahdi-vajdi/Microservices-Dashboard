import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateAgentCommand } from '../impl/create-agent.command';
import { AgentEntityRepository } from 'apps/agent/src/Domain/base-agent.entity-repo';
import { Agent } from 'apps/agent/src/Domain/entities/agent.entity';
import { Types } from 'mongoose';

@CommandHandler(CreateAgentCommand)
export class CreateAgentHandler
  implements ICommandHandler<CreateAgentCommand, void>
{
  constructor(private readonly agentRepo: AgentEntityRepository) {}

  async execute({ accountId, dto }: CreateAgentCommand): Promise<void> {
    const agent = Agent.create(
      new Types.ObjectId().toHexString(),
      accountId,
      dto.email,
      dto.phone,
      dto.firstName,
      dto.lastName,
      dto.title,
      dto.password,
      null,
      dto.role,
      'default',
    );

    await this.agentRepo.add(agent);
    agent.commit();
  }
}
