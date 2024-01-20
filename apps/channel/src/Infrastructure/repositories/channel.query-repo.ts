import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CHANNEL_DB_COLLECTION, ChannelModel } from '../models/channel.model';
import { Model, MongooseError } from 'mongoose';
import { DatabaseError } from '@app/common/errors/database.error';

/**
 * The repository for querying from database
 *
 * @export
 * @class ChannelQueryRepository
 * @typedef {ChannelQueryRepository}
 */
@Injectable()
export class ChannelQueryRepository {
  private readonly logger = new Logger(ChannelQueryRepository.name);

  constructor(
    @InjectModel(CHANNEL_DB_COLLECTION)
    private readonly channelModel: Model<ChannelModel>,
  ) {}

  /**
   * Get a channel model from database by its Id
   *
   * @async
   * @param {string} id
   * @returns {Promise<ChannelModel | null>}
   */
  async findOneById(id: string): Promise<ChannelModel | null> {
    try {
      return this.channelModel.findById(id, {}, { lean: true }).exec();
    } catch (error) {
      this.logger.error(error);

      if (error instanceof MongooseError)
        throw new DatabaseError(error.message);
      else throw new Error(error.message);
    }
  }

  /**
   * Get all the channel models for an account from database
   *
   * @async
   * @param {string} accountId
   * @returns {Promise<ChannelModel[]>}
   */
  async findByAccount(accountId: string): Promise<ChannelModel[]> {
    try {
      return await this.channelModel
        .find({ account: accountId }, {}, { lean: true })
        .exec();
    } catch (error) {
      this.logger.error(error);

      if (error instanceof MongooseError)
        throw new DatabaseError(error.message);
      else throw new Error(error.message);
    }
  }
}
