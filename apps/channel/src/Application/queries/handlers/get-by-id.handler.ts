import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetByIdQuery } from '../impl/get-by-id.query';
import { ChannelReadRepository } from 'apps/channel/src/Infrastructure/repositories/channel-read.repo';
import { ChannelModel } from 'apps/channel/src/Infrastructure/models/channel.model';

@QueryHandler(GetByIdQuery)
export class GetByIdHandler implements IQueryHandler<GetByIdQuery> {
  constructor(private readonly channelRepo: ChannelReadRepository) {}

  async execute(query: GetByIdQuery): Promise<ChannelModel | null> {
    const channel = await this.channelRepo.findOneById(query.channelId);

    if (channel && channel.owner.equals(query.userId)) return channel;
    else return null;
  }
}
