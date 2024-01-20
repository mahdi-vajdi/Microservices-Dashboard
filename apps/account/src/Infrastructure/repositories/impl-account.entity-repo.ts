import { InjectModel } from '@nestjs/mongoose';
import { Account } from '../../Domain/entities/account.entity';
import { AccountEntityRepository } from '../../Domain/base-account.entity-repo';
import { ACCOUNT_DB_COLLECTION, AccountModel } from '../models/account.model';
import { Model, MongooseError, Types } from 'mongoose';
import { Injectable, Logger } from '@nestjs/common';
import { DatabaseError } from '@app/common/errors/database.error';
import { NotFoundError } from '@app/common';

/**
 * Implementation of the AccountEntityRepository interface using Mongoose.
 *
 * @class
 * @implements {AccountEntityRepository}
 */
@Injectable()
export class AccountEntityRepositoryImpl implements AccountEntityRepository {
  private readonly logger = new Logger(AccountEntityRepositoryImpl.name);
  /**
   * Creates an instance of AccountEntityRepositoryImpl.
   *
   * @constructor
   * @param {Model<AccountModel>} accountModel - The Mongoose model for the account entity.
   */
  constructor(
    @InjectModel(ACCOUNT_DB_COLLECTION)
    private readonly accountModel: Model<AccountModel>,
  ) {}

  /**
   * Creates a new Mongodb document for account entity
   *
   * @param {Account} accountEntity - The account entity to be added.
   * @throws {DatabaseError} If an error occurs during the database operation.
   *   This error wraps Mongoose errors and provides a more specific indication of a database-related issue.
   * @throws {Error} If an unexpected error occurs during the database operation.
   *   This can include non-Mongoose-related errors.
   * @returns {Promise<void>} A Promise that resolves when the account is successfully added.
   */
  async add(accountEntity: Account): Promise<void> {
    try {
      await this.accountModel.create(this.fromEntity(accountEntity));
    } catch (error) {
      this.logger.error(error);

      if (error instanceof MongooseError)
        throw new DatabaseError(error.message);
      else throw new Error(error.message);
    }
  }

  /**
   * Updates an existing account document in the Mongodb.
   *
   * @param {Account} account - The account entity containing the updated information.
   * @throws {DatabaseError} If an error occurs during the database operation.
   *   This error wraps Mongoose errors and provides a more specific indication of a database-related issue.
   * @throws {Error} If an unexpected error occurs during the database operation.
   *   This can include non-Mongoose-related errors.
   * @returns {Promise<void>} A Promise that resolves when the account is successfully updated.
   */
  async save(account: Account): Promise<void> {
    try {
      await this.accountModel
        .findByIdAndUpdate(account.id, this.fromEntity(account), { lean: true })
        .exec();
    } catch (error) {
      this.logger.error(error);

      if (error instanceof MongooseError)
        throw new DatabaseError(error.message);
      else throw new Error(error.message);
    }
  }

  /**
   * Find an account document in the Mongodb using its ID.
   *
   * @param {String} id - The account entity containing the updated information.
   * @throws {DatabaseError} If an error occurs during the database operation.
   *   This error wraps Mongoose errors and provides a more specific indication of a database-related issue.
   * @throws {Error} If an unexpected error occurs during the database operation.
   *   This can include non-Mongoose-related errors.
   * @returns {Promise<void>} A Promise that resolves when the account is successfully updated.
   */
  async findOneById(id: string): Promise<Account> {
    try {
      const account = await this.accountModel
        .findById(id, {}, { lean: true })
        .exec();

      if (account) return this.toEntity(account);
      else throw new NotFoundError(`Account with id: ${id} does'nt exist`);
    } catch (error) {
      this.logger.error(error);

      if (error instanceof MongooseError)
        throw new DatabaseError(error.message);
      else throw new Error(error.message);
    }
  }

  /**
   * Converts an account entity to its corresponding Mongoose model.
   *
   * @param {Account} account - The account entity to convert.
   * @returns {AccountModel} The Mongoose model representing the account entity.
   * @private
   */
  private fromEntity(account: Account): AccountModel {
    return {
      _id: new Types.ObjectId(account.id),
      createdAt: account.createdAt,
      updatedAt: account.updatedAt,
      email: account.email,
    };
  }

  /**
   * Converts a Mongoose model to its corresponding account entity.
   *
   * @param {AccountModel} model - The Mongoose model to convert.
   * @returns {Account} The account entity representing the Mongoose model.
   * @private
   */
  private toEntity(model: AccountModel): Account {
    return new Account(
      model._id.toHexString(),
      model.createdAt,
      model.updatedAt,
      model.email,
    );
  }
}
