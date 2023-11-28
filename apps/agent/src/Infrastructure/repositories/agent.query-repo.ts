import { InjectModel } from '@nestjs/mongoose';
import { AgentModel } from '../models/agent.model';
import { Model } from 'mongoose';

export class AgentQueryepository {
  constructor(
    @InjectModel(AgentModel.name)
    private readonly agentModel: Model<AgentModel>,
  ) {}

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
}
