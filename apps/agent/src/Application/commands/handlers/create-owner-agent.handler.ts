import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateOwnerAgentCommand } from '../impl/create-owner-agent.command';
import { AgentDto, AgentRole } from '@app/common';
import { AgentEntityRepository } from 'apps/agent/src/Domain/base-agent.entity-repo';
import { Agent } from 'apps/agent/src/Domain/entities/agent.entity';
import { DomainAgentRole } from 'apps/agent/src/Domain/value-objects/agent-roles.enum';
import { Types } from 'mongoose';

@CommandHandler(CreateOwnerAgentCommand)
export class CreateOwnerAgentHandler
  implements ICommandHandler<CreateOwnerAgentCommand, AgentDto>
{
  constructor(private readonly agentRepo: AgentEntityRepository) {}

  async execute({ dto }: CreateOwnerAgentCommand): Promise<AgentDto> {
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
      DomainAgentRole.OWNER,
      'default',
    );

    await this.agentRepo.add(agent);
    agent.commit();
    return this.toAgentDto(agent);
  }

  private toAgentDto(agent: Agent): AgentDto {
    const agentDto = {
      id: agent.id,
      createdAt: agent.createdAt,
      updatedAt: agent.updatedAt,
      account: agent.admin,
      email: agent.email,
      phone: agent.phone,
      firstName: agent.firstName,
      lastName: agent.lastName,
      title: agent.title,
      role: AgentRole.OWNER,
      password: agent.password,
      refreshToken: agent.refreshToken,
    };
    return agentDto;
  }
}
