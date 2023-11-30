import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAccountChannelsQuery } from '../impl/get-account-cahnnels.query';
import { ChannelModel } from 'apps/channel/src/Infrastructure/models/channel.model';
import { ChannelQueryRepository } from 'apps/channel/src/Infrastructure/repositories/channel.query-repo';

@QueryHandler(GetAccountChannelsQuery)
export class GetAccountChannelsHandler
  implements IQueryHandler<GetAccountChannelsQuery>
{
  constructor(private readonly channelRepo: ChannelQueryRepository) {}

  async execute(query: GetAccountChannelsQuery): Promise<ChannelModel[]> {
    return await this.channelRepo.findByAccount(query.accountId);
  }
}
