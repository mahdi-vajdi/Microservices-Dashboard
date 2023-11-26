import { InjectModel } from '@nestjs/mongoose';
import { AgentModel } from '../models/agent.model';
import { Model } from 'mongoose';

export class AgentReadRepository {
  constructor(
    @InjectModel(AgentModel.name)
    private readonly agentMdodel: Model<AgentModel>,
  ) {}

  async findByAdmin(adminId: string): Promise<AgentModel[]> {
    return this.agentMdodel.find({ admin: adminId }, {}, { lean: true }).exec();
  }
}
