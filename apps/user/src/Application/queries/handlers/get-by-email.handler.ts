import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UserDto } from '@app/common';
import { GetByEmailQuery } from '../impl/get-by-email.query';
import { MongoUserQueryRepository } from 'apps/user/src/Infrastructure/repositories/user.query-repo';

@QueryHandler(GetByEmailQuery)
export class GetByEmailHandler
  implements IQueryHandler<GetByEmailQuery, UserDto | null>
{
  constructor(private readonly userRepo: MongoUserQueryRepository) {}

  async execute({ email }: GetByEmailQuery): Promise<UserDto | null> {
    return this.userRepo.findOneByEmail(email);
  }
}
