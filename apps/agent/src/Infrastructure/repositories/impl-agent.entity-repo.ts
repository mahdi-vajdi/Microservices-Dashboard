import { Injectable } from '@nestjs/common';
import { AgentEntityRepository } from '../../Domain/base-agent.entity-repo';
import { Agent } from '../../Domain/entities/agent.entity';
import { InjectModel } from '@nestjs/mongoose';
import { AgentModel } from '../models/agent.model';
import { Model, Types } from 'mongoose';

@Injectable()
export class AgentEntityRepositoryImpl implements AgentEntityRepository {
  constructor(
    @InjectModel(AgentModel.name)
    private readonly agentModel: Model<AgentModel>,
  ) {}

  async add(entity: Agent): Promise<void> {
    const agent = await this.agentModel.create(this.fromEntity(entity));
  }

  async save(entity: Agent): Promise<void> {
    const updatedAgent = await this.agentModel
      .findByIdAndUpdate(entity.id, this.fromEntity(entity))
      .exec();

    if (!updatedAgent) throw new Error('Agent not found');
  }

  async findById(id: string): Promise<Agent> {
    const agent = await this.agentModel.findById(id, {}, { lean: true }).exec();
    if (agent) return this.toEntity(agent);
    else throw new Error(`Agent with id: ${id} does'nt exist`);
  }

  private fromEntity(entity: Agent): AgentModel {
    return {
      _id: new Types.ObjectId(entity.id),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      email: entity.email,
      phone: entity.phone,
      title: entity.title,
      firstName: entity.firstName,
      lastName: entity.lastName,
      password: entity.password,
      avatar: entity.avatar,
      online: entity.online,
      account: new Types.ObjectId(entity.admin),
      role: entity.role,
      refreshToken: entity.refreshToken,
    };
  }

  private toEntity(model: AgentModel): Agent {
    return new Agent(
      model._id.toHexString(),
      model.createdAt,
      model.updatedAt,
      model.account.toHexString(),
      model.email,
      model.phone,
      model.firstName,
      model.lastName,
      model.title,
      model.password,
      model.refreshToken,
      model.role,
      model.avatar,
      model.online,
    );
  }
}
