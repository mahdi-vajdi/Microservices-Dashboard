import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateAgentCommand } from '../impl/create-agent.command';
import { AgentRepository } from 'apps/agent/src/Domain/agent.repo';
import { Agent } from 'apps/agent/src/Domain/entities/agent';
import { Types } from 'mongoose';

@CommandHandler(CreateAgentCommand)
export class CreateAgentHandler
  implements ICommandHandler<CreateAgentCommand, void>
{
  constructor(private readonly agentRepo: AgentRepository) {}

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
