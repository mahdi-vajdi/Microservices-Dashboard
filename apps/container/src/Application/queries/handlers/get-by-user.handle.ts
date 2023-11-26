import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ContainerReadRepository } from 'apps/container/src/Infrastructure/repositories/container-read.repo';
import { ContainerModel } from 'apps/container/src/Infrastructure/models/container.model';
import { GetUserContainersQuery } from '../impl/get-by-user.query';

@QueryHandler(GetUserContainersQuery)
export class GetUserContainersHandler
  implements IQueryHandler<GetUserContainersQuery>
{
  constructor(private readonly containerRepo: ContainerReadRepository) {}

  async execute(
    query: GetUserContainersQuery,
  ): Promise<ContainerModel[] | null> {
    return await this.containerRepo.findByUser(query.userId);
  }
}
