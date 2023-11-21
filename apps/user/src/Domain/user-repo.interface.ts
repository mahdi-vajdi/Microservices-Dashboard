import { User } from './user.domain';

export interface UserRepository {
  save(user: User): Promise<void>;
  findOneById(id: string): Promise<User>;
  findOneByEmail(email: string): Promise<User>;
}
