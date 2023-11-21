import { User } from '../Domain/user.domain';
import { UserRepository } from '../Domain/user.repo';

export class MongoUserRepository implements UserRepository {
  save(user: User): void {
    throw new Error('Method not implemented.');
  }
  findOneById(id: string): User {
    throw new Error('Method not implemented.');
  }
  findOneByEmail(email: string): User {
    throw new Error('Method not implemented.');
  }
}
