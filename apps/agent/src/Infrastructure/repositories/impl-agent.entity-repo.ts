import { Injectable, Logger } from '@nestjs/common';
import { AgentEntityRepository } from '../../Domain/base-agent.entity-repo';
import { Agent } from '../../Domain/entities/agent.entity';
import { InjectModel } from '@nestjs/mongoose';
import { AgentModel } from '../models/agent.model';
import { Model, MongooseError, Types } from 'mongoose';
import { DatabaseError } from '@app/common/errors/database.error';

/**
 * The implemetation of repository for command side of the service
 *
 * @export
 * @class AgentEntityRepositoryImpl
 * @typedef {AgentEntityRepositoryImpl}
 * @implements {AgentEntityRepository}
 */
@Injectable()
export class AgentEntityRepositoryImpl implements AgentEntityRepository {
  private readonly logger = new Logger(AgentEntityRepositoryImpl.name);

  constructor(
    @InjectModel(AgentModel.name)
    private readonly agentModel: Model<AgentModel>,
  ) {}

  /**
   * Create a new agent model in the database
   *
   * @async
   * @param {Agent} entity
   * @returns {Promise<void>}
   */
  async add(entity: Agent): Promise<void> {
    try {
      await this.agentModel.create(this.fromEntity(entity));
    } catch (error) {
      this.logger.error(error);

      if (error instanceof MongooseError)
        throw new DatabaseError(error.message);
      else throw new Error(error.message);
    }
  }

  /**
   * Update an existing agent model
   *
   * @async
   * @param {Agent} entity
   * @returns {Promise<void>}
   */
  async save(entity: Agent): Promise<void> {
    try {
      const updatedAgent = await this.agentModel
        .findByIdAndUpdate(entity.id, this.fromEntity(entity))
        .exec();

      if (!updatedAgent) throw new Error('Agent not found');
    } catch (error) {
      this.logger.error(error);

      if (error instanceof MongooseError)
        throw new DatabaseError(error.message);
      else throw new Error(error.message);
    }
  }

  /**
   * Find an agent model by its Id
   *
   * @async
   * @param {string} id
   * @returns {Promise<Agent>}
   */
  async findById(id: string): Promise<Agent> {
    try {
      const agent = await this.agentModel
        .findById(id, {}, { lean: true })
        .exec();
      if (agent) return this.toEntity(agent);
      else throw new Error(`Agent with id: ${id} does'nt exist`);
    } catch (error) {
      this.logger.error(error);

      if (error instanceof MongooseError)
        throw new DatabaseError(error.message);
      else throw new Error(error.message);
    }
  }

  /**
   * Convert agent entity to database model
   *
   * @private
   * @param {Agent} entity
   * @returns {AgentModel}
   */
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

  /**
   * Convert agent database model to entity
   *
   * @private
   * @param {AgentModel} model
   * @returns {Agent}
   */
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
