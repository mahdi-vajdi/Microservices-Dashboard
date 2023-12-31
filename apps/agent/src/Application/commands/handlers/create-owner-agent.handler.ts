import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateOwnerAgentCommand } from '../impl/create-owner-agent.command';
import { AgentEntityRepository } from 'apps/agent/src/Domain/base-agent.entity-repo';
import { Agent } from 'apps/agent/src/Domain/entities/agent.entity';
import { Types } from 'mongoose';
import { AgentRole } from '@app/common';

@CommandHandler(CreateOwnerAgentCommand)
export class CreateOwnerAgentHandler
  implements ICommandHandler<CreateOwnerAgentCommand, void>
{
  constructor(private readonly agentRepo: AgentEntityRepository) {}

  async execute({ dto }: CreateOwnerAgentCommand): Promise<void> {
    const agent = Agent.create(
      new Types.ObjectId().toHexString(),
      dto.accountId,
      dto.email,
      dto.phone,
      dto.firstName,
      dto.lastName,
      dto.firstName,
      dto.password,
      null,
      AgentRole.OWNER,
      'default',
    );

    await this.agentRepo.add(agent);
    agent.commit();
  }
}
