import { User } from './entities/user.entity';

export abstract class UserEntityRepository {
  abstract add(user: User): Promise<User>;
  abstract save(user: User): Promise<void>;
  abstract findOneById(id: string): Promise<User>;
}
