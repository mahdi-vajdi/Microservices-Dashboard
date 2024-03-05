import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CHANNEL_DB_COLLECTION, ChannelModel } from '../models/channel.model';
import { Model, MongooseError } from 'mongoose';
import { DatabaseError } from '@app/common/errors/database.error';

/**
 * The repository for querying from MongoDb database
 *
 * @export
 * @class ChannelQueryRepository
 */
@Injectable()
export class ChannelQueryRepository {
  private readonly logger = new Logger(ChannelQueryRepository.name);

  constructor(
    @InjectModel(CHANNEL_DB_COLLECTION)
    private readonly channelModel: Model<ChannelModel>,
  ) {}

  async findOneById(
    accountId: string,
    channelId: string,
  ): Promise<ChannelModel | null> {
    try {
      return this.channelModel
        .findOne({ _id: channelId, account: accountId }, {}, { lean: true })
        .exec();
    } catch (error) {
      this.logger.error(error);

      if (error instanceof MongooseError)
        throw new DatabaseError(error.message);
      else throw new Error(error.message);
    }
  }

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
