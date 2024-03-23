import { InjectModel } from '@nestjs/mongoose';
import { AgentModel as AgentModel } from '../models/agent.model';
import { Model, MongooseError, Types } from 'mongoose';
import { Logger } from '@nestjs/common';
import { DatabaseError } from '@app/common/errors/database.error';
import { AgentDto } from '@app/common';
/**
 * Repository for query side of the agent service
 *
 * @export
 * @class AgentQueryRepository
 * @typedef {AgentQueryRepository}
 */
export class AgentQueryRepository {
  private readonly logger = new Logger(AgentQueryRepository.name);

  constructor(
    @InjectModel(AgentModel.name)
    private readonly agentModel: Model<AgentModel>,
  ) {}

  /**
   * Get agent by its Id
   *
   * @async
   * @param {string} agentId
   * @returns {Promise<AgentModel | null>}
   */
  async findById(agentId: string): Promise<AgentModel | null> {
    try {
      const agent = await this.agentModel.findById(agentId, {}, { lean: true });
      if (agent) return agent;
      else return null;
    } catch (error) {
      this.logger.error(error);

      if (error instanceof MongooseError)
        throw new DatabaseError(error.message);
      else throw new Error(error.message);
    }
  }

  /**
   * Get agent by its email
   *
   * @async
   * @param {string} email
   * @returns {Promise<AgentDto | null>}
   */
  async findByEmail(email: string): Promise<AgentDto | null> {
    try {
      const agent = await this.agentModel
        .findOne({ email }, {}, { lean: true })
        .exec();
      if (agent) return this.toDto(agent);
      else return null;
    } catch (error) {
      this.logger.error(error);

      if (error instanceof MongooseError)
        throw new DatabaseError(error.message);
      else throw new Error(error.message);
    }
  }

  /**
   * Get all the agents for an account Id
   *
   * @async
   * @param {string} accountId
   * @returns {Promise<AgentModel[]>}
   */
  async findByAccount(accountId: string): Promise<AgentModel[]> {
    try {
      const agents = await this.agentModel
        .find({ account: accountId }, {}, { lean: true })
        .exec();

      return agents;
    } catch (error) {
      this.logger.error(error);

      if (error instanceof MongooseError)
        throw new DatabaseError(error.message);
      else throw new Error(error.message);
    }
  }

  /**
   * Get Ids for all the agents of an account
   *
   * @async
   * @param {string} accountId
   * @returns {Promise<string[]>}
   */
  async findIdsByAccount(accountId: string): Promise<string[]> {
    try {
      const models = await this.agentModel.find(
        { account: accountId },
        { _id: 1 },
        { lean: true },
      );

      return models.map((model) => model._id.toHexString());
    } catch (error) {
      this.logger.error(error);

      if (error instanceof MongooseError)
        throw new DatabaseError(error.message);
      else throw new Error(error.message);
    }
  }

  /**
   * Check if anget exists whith the proviced info
   *
   * @async
   * @param {string} email
   * @param {string} phone
   * @returns {Promise<{
   *     _id: Types.ObjectId;
   *   } | null>}
   */
  async agentExists(
    email: string,
    phone: string,
  ): Promise<{
    _id: Types.ObjectId;
  } | null> {
    try {
      return await this.agentModel
        .exists({ $or: [{ email }, { phone }] })
        .exec();
    } catch (error) {
      this.logger.error(error);

      if (error instanceof MongooseError)
        throw new DatabaseError(error.message);
      else throw new Error(error.message);
    }
  }

  private toDto(agent: AgentModel): AgentDto {
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
      refreshToken: agent.refreshToken,
      role: agent.role,
      avatar: agent.avatar,
      online: agent.online,
    };
  }
}
