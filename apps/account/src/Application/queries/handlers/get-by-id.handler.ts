import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetByIdQuery } from '../impl/get-by-id.query';
import { AccountQueryRepository } from 'apps/account/src/Infrastructure/repositories/account.query-repo';
import { AccountDto } from '@app/common/dto/account.dto';

@QueryHandler(GetByIdQuery)
export class GetByIdHandler
  implements IQueryHandler<GetByIdQuery, AccountDto | null>
{
  constructor(private readonly accountRepo: AccountQueryRepository) {}

  async execute({ id }: GetByIdQuery): Promise<AccountDto | null> {
    return await this.accountRepo.findOneById(id);
  }
}
