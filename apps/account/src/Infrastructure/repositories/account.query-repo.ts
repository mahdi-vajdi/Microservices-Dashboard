import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ACCOUNT_DB_COLLECTION, AccountModel } from '../models/account.model';
import { Model, MongooseError } from 'mongoose';
import { DatabaseError } from '@app/common/errors/database.error';

@Injectable()
export class AccountQueryRepository {
  private readonly logger = new Logger(AccountQueryRepository.name);

  constructor(
    @InjectModel(ACCOUNT_DB_COLLECTION)
    private readonly accountModel: Model<AccountModel>,
  ) {}

  /**
   * Finds an account in the database by its ID.
   *
   * @param {string} id - The ID of the account to find.
   * @returns {Promise<AccountModel | null>} A Promise that resolves with the found account or null if not found.
   */
  async findOneById(id: string): Promise<AccountModel | null> {
    try {
      return await this.accountModel.findById(id, {}, { lean: true }).exec();
    } catch (error) {
      this.logger.error(error);

      if (error instanceof MongooseError)
        throw new DatabaseError(error.message);
      else throw new Error(error.message);
    }
  }

  /**
   * Finds an account in the database by its email.
   *
   * @param {string} email - The email of the account to find.
   * @returns {Promise<AccountModel | null>} A Promise that resolves with the found account or null if not found.
   */
  async findOneByEmail(email: string): Promise<AccountModel | null> {
    try {
      return await this.accountModel
        .findOne({ email }, {}, { lean: true })
        .exec();
    } catch (error) {
      this.logger.error(error);

      if (error instanceof MongooseError)
        throw new DatabaseError(error.message);
      else throw new Error(error.message);
    }
  }
}
