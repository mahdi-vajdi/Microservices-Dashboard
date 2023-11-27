import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUserChannelsQuery } from '../impl/get-user-cahnnels.query';
import { ChannelModel } from 'apps/channel/src/Infrastructure/models/channel.model';
import { ChannelQueryRepository } from 'apps/channel/src/Infrastructure/repositories/channel.query-repo';

@QueryHandler(GetUserChannelsQuery)
export class GetUserChannelsHandler
  implements IQueryHandler<GetUserChannelsQuery>
{
  constructor(private readonly channelRepo: ChannelQueryRepository) {}

  async execute(query: GetUserChannelsQuery): Promise<ChannelModel[]> {
    return await this.channelRepo.findByUser(query.userId);
  }
}
