import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { AccountQueryRepository } from 'apps/account/src/Infrastructure/repositories/account.query-repo';
import { GetByEmailQuery } from '../impl/get-by-email.query';
import { AccountDto } from '@app/common/dto/account.dto';

@QueryHandler(GetByEmailQuery)
export class GetByEmailHandler
  implements IQueryHandler<GetByEmailQuery, AccountDto | null>
{
  constructor(private readonly accountRepo: AccountQueryRepository) {}

  async execute({ email }: GetByEmailQuery): Promise<AccountDto | null> {
    return await this.accountRepo.findOneByEmail(email);
  }
}
