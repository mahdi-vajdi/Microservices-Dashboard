import { Account } from './entities/account.entity';

export abstract class AccountEntityRepository {
  abstract add(account: Account): Promise<void>;
  abstract save(account: Account): Promise<void>;
  abstract findOneById(id: string): Promise<Account>;
}
