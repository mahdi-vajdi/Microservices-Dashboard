import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UserDto } from '@app/common';
import { UserReadRepository } from 'apps/user/src/Infrastructure/user.read-repo';
import { GetByEmailQuery } from '../impl/get-by-email.query';

@QueryHandler(GetByEmailQuery)
export class GetByEmailHandler
  implements IQueryHandler<GetByEmailQuery, UserDto>
{
  constructor(private readonly userRepo: UserReadRepository) {}

  async execute({ email }: GetByEmailQuery): Promise<UserDto> {
    return this.userRepo.findOneByEmail(email);
  }
}
