import { Types } from 'mongoose';
import { Channel } from '../../Domain/models/channel';
import { ChannelRepository } from '../../Domain/base-channel.repo';
import { ChannelModel } from '../models/channel.model';

export class ChannelWriteRepository extends ChannelRepository {
  add(entity: Channel): Promise<void> {
    throw new Error('Method not implemented.');
  }

  findById(id: string): Promise<Channel> {
    throw new Error('Method not implemented.');
  }

  private fromEntity(channel: Channel): ChannelModel {
    return {
      _id: new Types.ObjectId(channel.id),
      createdAt: channel.createdAt,
      updatedAt: channel.updatedAt,
      owner: new Types.ObjectId(channel.owner),
      title: channel.title,
      url: channel.url,
      token: channel.token,
      isEnabled: channel.isEnabled,
      agents: channel.agents.map((agent) => new Types.ObjectId(agent)),
      settings: channel.settings,
    };
  }

  private toEntity(model: ChannelModel): Channel {
    return new Channel(
      model._id.toHexString(),
      model.createdAt,
      model.updatedAt,
      model.owner.toHexString(),
      model.title,
      model.url,
      model.token,
      model.isEnabled,
      model.agents.map((agent) => agent.toHexString()),
      model.settings,
    );
  }
}
