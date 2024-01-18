import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ACCOUNT_DB_COLLECTION, AccountModel } from '../models/account.model';
import { Model } from 'mongoose';

@Injectable()
export class AccountQueryRepository {
  constructor(
    @InjectModel(ACCOUNT_DB_COLLECTION)
    private readonly account: Model<AccountModel>,
  ) {}

  /**
   * Finds an account in the database by its ID.
   *
   * @param {string} id - The ID of the account to find.
   * @returns {Promise<AccountModel | null>} A Promise that resolves with the found account or null if not found.
   */
  async findOneById(id: string): Promise<AccountModel | null> {
    return await this.account.findById(id, {}, { lean: true }).exec();
  }

  /**
   * Finds an account in the database by its email.
   *
   * @param {string} email - The email of the account to find.
   * @returns {Promise<AccountModel | null>} A Promise that resolves with the found account or null if not found.
   */
  async findOneByEmail(email: string): Promise<AccountModel | null> {
    return await this.account.findOne({ email }, {}, { lean: true }).exec();
  }
}
