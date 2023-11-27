import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUserChannelsQuery } from '../impl/get-user-cahnnels.query';
import { ChannelReadRepository } from 'apps/channel/src/Infrastructure/repositories/channel-read.repo';
import { ChannelModel } from 'apps/channel/src/Infrastructure/models/channel.model';

@QueryHandler(GetUserChannelsQuery)
export class GetUserChannelHandler
  implements IQueryHandler<GetUserChannelsQuery>
{
  constructor(private readonly channelRepo: ChannelReadRepository) {}

  async execute(query: GetUserChannelsQuery): Promise<ChannelModel[] | null> {
    return await this.channelRepo.findByUser(query.userId);
  }
}
