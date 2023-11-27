import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UserExistsQuery } from '../impl/user-exists-query';
import { MongoUserQueryRepository } from 'apps/user/src/Infrastructure/repositories/user.query-repo';

@QueryHandler(UserExistsQuery)
export class UserExistsHandler
  implements IQueryHandler<UserExistsQuery, boolean>
{
  constructor(private readonly userRepo: MongoUserQueryRepository) {}

  async execute(query: any): Promise<boolean> {
    const exists = await this.userRepo.userExists(query.email, query.phone);
    if (exists) return true;
    else return false;
  }
}
