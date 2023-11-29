import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetByIdQuery } from '../impl/get-by-id.query';
import { UserDto } from '@app/common';
import { AccountQueryRepository } from 'apps/account/src/Infrastructure/repositories/account.query-repo';

@QueryHandler(GetByIdQuery)
export class GetByIdHandler implements IQueryHandler<GetByIdQuery, UserDto> {
  constructor(private readonly accountRepo: AccountQueryRepository) {}

  async execute({ id }: GetByIdQuery): Promise<UserDto> {
    return this.accountRepo.findOneById(id);
  }
}
