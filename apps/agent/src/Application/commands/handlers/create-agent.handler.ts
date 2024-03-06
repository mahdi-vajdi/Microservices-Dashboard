import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateAgentCommand } from '../impl/create-agent.command';
import { AgentEntityRepository } from 'apps/agent/src/Domain/base-agent.entity-repo';
import { Agent } from 'apps/agent/src/Domain/entities/agent.entity';
import { Types } from 'mongoose';
import * as bcrypt from 'bcryptjs';

@CommandHandler(CreateAgentCommand)
export class CreateAgentHandler
  implements ICommandHandler<CreateAgentCommand, void>
{
  constructor(private readonly agentEntityRepo: AgentEntityRepository) {}

  async execute(command: CreateAgentCommand): Promise<void> {
    const agent = Agent.create(
      new Types.ObjectId().toHexString(),
      command.requesterAccountId,
      command.email,
      command.phone,
      command.firstName,
      command.lastName,
      command.title,
      await bcrypt.hash(command.password, 10),
      null,
      command.role,
      'default',
    );

    await this.agentEntityRepo.add(agent);
    agent.commit();
  }
}
