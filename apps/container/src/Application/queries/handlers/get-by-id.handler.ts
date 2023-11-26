import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetByIdQuery } from '../impl/get-by-id.query';
import { ContainerReadRepository } from 'apps/container/src/Infrastructure/repositories/container-read.repo';
import { ContainerModel } from 'apps/container/src/Infrastructure/models/container.model';

@QueryHandler(GetByIdQuery)
export class GetByIdHandler implements IQueryHandler<GetByIdQuery> {
  constructor(private readonly containerRepo: ContainerReadRepository) {}

  async execute(query: GetByIdQuery): Promise<ContainerModel | null> {
    const container = await this.containerRepo.findOneById(query.containerId);

    if (container && container.owner.equals(query.userId)) return container;
    else return null;
  }
}
