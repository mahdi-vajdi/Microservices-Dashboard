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
}
