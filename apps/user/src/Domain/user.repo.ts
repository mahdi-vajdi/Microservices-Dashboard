import { User } from './entities/user.entity';

export interface UserRepository {
  add(user: User): Promise<User>;
  save(user: User): Promise<void>;
  findOneById(id: string): Promise<User>;
}
