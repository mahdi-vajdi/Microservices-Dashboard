import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetByIdQuery } from '../impl/get-by-id.query';
import { ChannelModel } from 'apps/channel/src/Infrastructure/models/channel.model';
import { ChannelQueryRepository } from 'apps/channel/src/Infrastructure/repositories/channel.query-repo';

@QueryHandler(GetByIdQuery)
export class GetByIdHandler implements IQueryHandler<GetByIdQuery> {
  constructor(private readonly channelRepo: ChannelQueryRepository) {}

  async execute(query: GetByIdQuery): Promise<ChannelModel | null> {
    const channel = await this.channelRepo.findOneById(query.channelId);

    if (channel && channel.account?.equals(query.accountId)) {
      return channel;
    } else return null;
  }
}
