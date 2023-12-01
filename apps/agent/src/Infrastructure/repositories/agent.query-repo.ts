import { InjectModel } from '@nestjs/mongoose';
import { AgentModel as AgentModel } from '../models/agent.model';
import { Model } from 'mongoose';
import { AgentDto, AgentRole } from '@app/common';
import { DomainAgentRole } from '../../Domain/value-objects/agent-roles.enum';

export class AgentQueryRepository {
  constructor(
    @InjectModel(AgentModel.name)
    private readonly agentModel: Model<AgentModel>,
  ) {}

  async findById(agentId: string): Promise<AgentDto | null> {
    const agent = await this.agentModel.findById(agentId, {}, { lean: true });
    if (agent) return this.deSerialize(agent);
    else return null;
  }

  async findByEmail(email: string): Promise<AgentDto | null> {
    const agent = await this.agentModel
      .findOne({ email }, {}, { lean: true })
      .exec();
    if (agent) return this.deSerialize(agent);
    else return null;
  }

  async findByAccount(accountId: string): Promise<AgentModel[]> {
    const agents = await this.agentModel
      .find({ account: accountId }, {}, { lean: true })
      .exec();

    return agents;
  }

  async findIdsByAccount(accountId: string): Promise<string[]> {
    const models = await this.agentModel.find(
      { account: accountId },
      { _id: 1 },
      { lean: true },
    );

    return models.map((model) => model._id.toHexString());
  }

  async agentExists(email: string, phone: string) {
    return this.agentModel.exists({ $or: [{ email }, { phone }] }).exec();
  }

  private deSerialize(agent: AgentModel): AgentDto {
    return {
      id: agent._id.toHexString(),
      createdAt: agent.createdAt,
      updatedAt: agent.updatedAt,
      account: agent.account.toHexString(),
      email: agent.email,
      phone: agent.phone,
      firstName: agent.firstName,
      lastName: agent.lastName,
      title: agent.title,
      role: agent.role as unknown as AgentRole,
      password: agent.password,
      refreshToken: agent.refreshToken,
    };
  }
}
