import { InjectModel } from '@nestjs/mongoose';
import { AgentModel as AgentModel } from '../models/agent.model';
import { Model } from 'mongoose';
export class AgentQueryRepository {
  constructor(
    @InjectModel(AgentModel.name)
    private readonly agentModel: Model<AgentModel>,
  ) {}

  async findById(agentId: string): Promise<AgentModel | null> {
    const agent = await this.agentModel.findById(agentId, {}, { lean: true });
    if (agent) return agent;
    else return null;
  }

  async findByEmail(email: string): Promise<AgentModel | null> {
    const agent = await this.agentModel
      .findOne({ email }, {}, { lean: true })
      .exec();
    if (agent) return agent;
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
}
