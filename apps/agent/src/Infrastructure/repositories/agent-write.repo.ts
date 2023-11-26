import { Injectable } from '@nestjs/common';
import { AgentRepository } from '../../Domain/agent.repo';
import { Agent } from '../../Domain/entities/agent';
import { InjectModel } from '@nestjs/mongoose';
import { AgentModel } from '../models/agent.model';
import { Model, Types } from 'mongoose';

@Injectable()
export class AgentWriteRepository implements AgentRepository {
  constructor(
    @InjectModel(AgentModel.name)
    private readonly agentModel: Model<AgentModel>,
  ) {}

  async add(entity: Agent): Promise<void> {
    await this.agentModel.create(this.fromEntity(entity));
  }

  async save(entity: Agent): Promise<void> {
    const updatedAgent = await this.agentModel
      .findByIdAndUpdate(entity.id, this.fromEntity(entity))
      .exec();

    if (updatedAgent) throw new Error('user not found');
  }

  async findById(id: string): Promise<Agent> {
    const agent = await this.agentModel.findById(id, {}, { lean: true }).exec();
    if (agent) return this.toEntity(agent);
    else throw new Error(`User with id: ${id} does'nt exist`);
  }

  private fromEntity(entity: Agent): AgentModel {
    return {
      _id: new Types.ObjectId(entity.id),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      email: entity.email,
      phone: entity.phone,
      title: entity.title,
      name: entity.name,
      password: entity.password,
      avatar: entity.avatar,
      online: entity.online,
      admin: new Types.ObjectId(entity.admin),
      role: entity.role,
    };
  }

  private toEntity(model: AgentModel): Agent {
    return new Agent(
      model._id.toHexString(),
      model.createdAt,
      model.updatedAt,
      model.email,
      model.phone,
      model.title,
      model.name,
      model.password,
      model.avatar,
      model.admin.toHexString(),
      model.role,
      model.online,
    );
  }
}
