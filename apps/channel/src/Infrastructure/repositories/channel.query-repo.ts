import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CHANNEL_DB_COLLECTION, ChannelModel } from '../models/channel.model';
import { Model } from 'mongoose';

@Injectable()
export class ChannelQueryRepository {
  constructor(
    @InjectModel(CHANNEL_DB_COLLECTION)
    private readonly channelModel: Model<ChannelModel>,
  ) {}

  async findOneById(id: string): Promise<ChannelModel | null> {
    return this.channelModel.findById(id, {}, { lean: true }).exec();
  }

  async findByUser(userId: string): Promise<ChannelModel[]> {
    return await this.channelModel
      .find({ owner: userId }, {}, { lean: true })
      .exec();
  }
}
