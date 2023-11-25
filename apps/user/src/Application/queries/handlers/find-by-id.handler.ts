import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetByIdQuery } from '../impl/find-by-id.query';
import { MongoUserReadRepository } from 'apps/user/src/Infrastructure/mongo-user.read-repo';
import { UserDto } from '@app/common';

@QueryHandler(GetByIdQuery)
export class GetByIdHandler implements IQueryHandler<GetByIdQuery, UserDto> {
  constructor(private readonly userRepo: MongoUserReadRepository) {}

  async execute({ id }: GetByIdQuery): Promise<UserDto> {
    return this.userRepo.findOneById(id);
  }
}
