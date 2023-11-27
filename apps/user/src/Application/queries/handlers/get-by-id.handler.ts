import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetByIdQuery } from '../impl/get-by-id.query';
import { UserDto } from '@app/common';
import { MongoUserQueryRepository } from 'apps/user/src/Infrastructure/repositories/user.query-repo';

@QueryHandler(GetByIdQuery)
export class GetByIdHandler implements IQueryHandler<GetByIdQuery, UserDto> {
  constructor(private readonly userRepo: MongoUserQueryRepository) {}

  async execute({ id }: GetByIdQuery): Promise<UserDto> {
    return this.userRepo.findOneById(id);
  }
}
