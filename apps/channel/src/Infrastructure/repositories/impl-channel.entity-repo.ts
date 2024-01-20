import { Model, MongooseError, Types } from 'mongoose';
import { Channel } from '../../Domain/entities/channel.entity';
import { ChannelEntityRepository } from '../../Domain/base-channel.repo';
import { CHANNEL_DB_COLLECTION, ChannelModel } from '../models/channel.model';
import { InjectModel } from '@nestjs/mongoose';
import { Logger } from '@nestjs/common';
import { DatabaseError } from '@app/common/errors/database.error';

/**
 * The implementation of repository class for abstract ChannelEntityRepository
 *
 * @export
 * @class ChannelEntityRepositoryImpl
 * @typedef {ChannelEntityRepositoryImpl}
 * @implements {ChannelEntityRepository}
 */
export class ChannelEntityRepositoryImpl implements ChannelEntityRepository {
  private readonly logger = new Logger(ChannelEntityRepositoryImpl.name);

  constructor(
    @InjectModel(CHANNEL_DB_COLLECTION)
    private readonly channelModel: Model<ChannelModel>,
  ) {}

  /**
   * Create a new channel model in database
   *
   * @async
   * @param {Channel} entity
   * @returns {Promise<void>}
   */
  async add(entity: Channel): Promise<void> {
    try {
      await this.channelModel.create(this.fromEntity(entity));
    } catch (error) {
      this.logger.error(error);

      if (error instanceof MongooseError)
        throw new DatabaseError(error.message);
      else throw new Error(error.message);
    }
  }

  /**
   * Update an existing channel model in the datavbase
   *
   * @async
   * @param {Channel} entity
   * @returns {Promise<void>}
   */
  async save(entity: Channel): Promise<void> {
    try {
      await this.channelModel.findByIdAndUpdate(
        entity.id,
        this.fromEntity(entity),
        { lean: true },
      );
    } catch (error) {
      this.logger.error(error);

      if (error instanceof MongooseError)
        throw new DatabaseError(error.message);
      else throw new Error(error.message);
    }
  }

  /**
   * Find a channel model form database by its Id
   *
   * @async
   * @param {string} id
   * @returns {Promise<Channel | null>}
   */
  async findById(id: string): Promise<Channel | null> {
    try {
      const channel = await this.channelModel
        .findById(id, {}, { lean: true })
        .exec();
      if (channel) return this.toEntity(channel);
      else return null;
    } catch (error) {
      this.logger.error(error);

      if (error instanceof MongooseError)
        throw new DatabaseError(error.message);
      else throw new Error(error.message);
    }
  }

  /**
   * Convert a channel entity to model
   *
   * @private
   * @param {Channel} channel
   * @returns {ChannelModel}
   */
  private fromEntity(channel: Channel): ChannelModel {
    return {
      _id: new Types.ObjectId(channel.id),
      createdAt: channel.createdAt,
      updatedAt: channel.updatedAt,
      account: new Types.ObjectId(channel.account),
      title: channel.title,
      url: channel.url,
      token: channel.token,
      isEnabled: channel.isEnabled,
      agents: channel.agents.map((agent) => new Types.ObjectId(agent)),
      settings: channel.settings,
    };
  }

  /**
   * Convert a channel model to entity
   *
   * @private
   * @param {ChannelModel} model
   * @returns {Channel}
   */
  private toEntity(model: ChannelModel): Channel {
    return new Channel(
      model._id.toHexString(),
      model.createdAt,
      model.updatedAt,
      model.account.toHexString(),
      model.title,
      model.url,
      model.token,
      model.isEnabled,
      model.agents.map((agent) => agent.toHexString()),
      model.settings,
    );
  }
}
