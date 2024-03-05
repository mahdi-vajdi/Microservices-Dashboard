import { Channel } from './entities/channel.entity';

export abstract class ChannelEntityRepository {
  abstract add(entity: Channel): Promise<string>;
  abstract save(entity: Channel): Promise<void>;
  abstract findById(id: string): Promise<Channel | null>;
}
