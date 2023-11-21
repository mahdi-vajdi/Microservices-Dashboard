import { User } from './user.domain';

export interface UserRepository {
  save(user: User): void;
  findOneById(id: string): User;
  findOneByEmail(email: string): User;
}
