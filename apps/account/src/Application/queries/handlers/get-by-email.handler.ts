import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { AccountQueryRepository } from 'apps/account/src/Infrastructure/repositories/account.query-repo';
import { AccountModel } from 'apps/account/src/Infrastructure/models/account.model';
import { GetByEmailQuery } from '../impl/get-by-email.query';

@QueryHandler(GetByEmailQuery)
export class GetByEmailHandler
  implements IQueryHandler<GetByEmailQuery, AccountModel | null>
{
  constructor(private readonly accountRepo: AccountQueryRepository) {}

  async execute({ email }: GetByEmailQuery): Promise<AccountModel | null> {
    return await this.accountRepo.findOneByEmail(email);
  }
}
