import { InjectModel } from '@nestjs/mongoose';
import { AgentModel as AgentModel } from '../models/agent.model';
import { Model } from 'mongoose';
import { AgentDto } from '@app/common';

export class AgentQueryepository {
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

  async findByAdmin(adminId: string): Promise<AgentModel[]> {
    return this.agentModel.find({ admin: adminId }, {}, { lean: true }).exec();
  }

  async findIdsByAdmin(adminId: string): Promise<string[]> {
    const ids = await this.agentModel.find(
      { admin: adminId },
      { _id: 1 },
      { lean: true },
    );

    return ids.map((id) => id._id.toHexString());
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
      password: agent.password,
      refreshToken: agent.refreshToken,
    };
  }
}
