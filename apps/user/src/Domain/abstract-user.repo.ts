import { User } from './user.domain';

export abstract class UserRepository {
  abstract add(user: User): Promise<User>;
  abstract save(user: User): Promise<void>;
  abstract findOneById(id: string): Promise<User>;
}
