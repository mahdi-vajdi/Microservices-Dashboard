import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UserDto } from '@app/common';
import { MongoUserReadRepository } from 'apps/user/src/Infrastructure/mongo-user.read-repo';
import { GetByEmailQuery } from '../impl/get-by-email.query';

@QueryHandler(GetByEmailQuery)
export class GetByEmailHandler
  implements IQueryHandler<GetByEmailQuery, UserDto>
{
  constructor(private readonly userRepo: MongoUserReadRepository) {}

  async execute({ email }: GetByEmailQuery): Promise<UserDto> {
    return this.userRepo.findOneByEmail(email);
  }
}
