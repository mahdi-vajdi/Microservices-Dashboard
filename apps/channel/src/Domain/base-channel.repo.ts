import { Channel } from './models/channel';

export abstract class ChannelRepository {
  abstract add(entity: Channel): Promise<void>;
  abstract findById(id: string): Promise<Channel>;
}
