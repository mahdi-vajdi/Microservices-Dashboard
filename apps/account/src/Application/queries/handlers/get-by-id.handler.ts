import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetByIdQuery } from '../impl/get-by-id.query';
import { AccountQueryRepository } from 'apps/account/src/Infrastructure/repositories/account.query-repo';
import { AccountModel } from 'apps/account/src/Infrastructure/models/account.model';

@QueryHandler(GetByIdQuery)
export class GetByIdHandler
  implements IQueryHandler<GetByIdQuery, AccountModel | null>
{
  constructor(private readonly accountRepo: AccountQueryRepository) {}

  async execute({ id }: GetByIdQuery): Promise<AccountModel | null> {
    return await this.accountRepo.findOneById(id);
  }
}
