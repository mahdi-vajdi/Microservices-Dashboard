import { Account } from './entities/account.entity';

/**
 * Abstract class for interacting with an account entity repository.
 *
 * @abstract
 * @class AccountEntityRepository
 * @name AccountEntityRepository
 */
export abstract class AccountEntityRepository {
  /**
   * Adds a new account to the repository.
   *
   * @abstract
   * @param {Account} account - The account entity to be added.
   * @returns {Promise<void>} A Promise that resolves when the account is successfully added.
   */
  abstract add(account: Account): Promise<void>;

  /**
   * Saves updates to an existing account in the repository.
   *
   * @abstract
   * @param {Account} account - The updated account entity to be saved.
   * @returns {Promise<void>} A Promise that resolves when the account is successfully saved.
   */
  abstract save(account: Account): Promise<void>;

  /**
   * Finds an account in the repository by its ID.
   *
   * @abstract
   * @param {string} id - The ID of the account to find.
   * @returns {Promise<Account>} A Promise that resolves with the found account entity.
   * @typedef {Account} AccountEntityRepository#findOneByIdReturnType
   */
  abstract findOneById(id: string): Promise<Account>;
}
