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

  async execute({ userId, dto }: CreateAgentCommand): Promise<void> {
    const agent = Agent.create(
      new Types.ObjectId().toHexString(),
      dto.email,
      dto.phone,
      dto.title,
      dto.name,
      dto.password,
      userId,
      dto.role,
    );

    await this.agentRepo.add(agent);
    agent.commit();
  }
}
