import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetChannelByIdQuery } from '../impl/get-by-id.query';
import { ChannelModel } from 'apps/channel/src/Infrastructure/models/channel.model';
import { ChannelQueryRepository } from 'apps/channel/src/Infrastructure/repositories/channel.query-repo';

@QueryHandler(GetChannelByIdQuery)
export class GetByIdHandler implements IQueryHandler<GetChannelByIdQuery> {
  constructor(private readonly channelRepo: ChannelQueryRepository) {}

  async execute(query: GetChannelByIdQuery): Promise<ChannelModel | null> {
    return await this.channelRepo.findOneById(query.accountId, query.channelId);
  }
}
