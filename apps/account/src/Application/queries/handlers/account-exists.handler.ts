import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { AccountExistsQuery } from '../impl/account-exists.query';
import { AccountQueryRepository } from 'apps/account/src/Infrastructure/repositories/account.query-repo';

@QueryHandler(AccountExistsQuery)
export class AccountExistsHandler
  implements IQueryHandler<AccountExistsQuery, boolean>
{
  constructor(private readonly queryRepo: AccountQueryRepository) {}

  async execute(query: AccountExistsQuery): Promise<boolean> {
    const account = await this.queryRepo.findOneByEmail(query.email);
    if (account) return true;
    else return false;
  }
}
