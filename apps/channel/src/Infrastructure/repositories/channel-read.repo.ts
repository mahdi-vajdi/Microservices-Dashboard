import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ChannelModel } from '../models/channel.model';
import { Model } from 'mongoose';

@Injectable()
export class ChannelReadRepository {
  constructor(
    @InjectModel(ChannelModel.name)
    private readonly channelModel: Model<ChannelModel>,
  ) {}

  async findOneById(id: string): Promise<ChannelModel | null> {
    return this.channelModel.findById(id, {}, { lean: true }).exec();
  }

  async findByUser(userId: string): Promise<ChannelModel[]> {
    return await this.channelModel
      .find({ owner: userId }, { lean: true })
      .exec();
  }
}
