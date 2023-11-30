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
  async findOneById(id: string): Promise<AccountModel | null> {
    const account = await this.account.findById(id, {}, { lean: true }).exec();
    return account;
  }

  async findOneByEmail(email: string): Promise<AccountModel | null> {
    const account = await this.account
      .findOne({ email }, {}, { lean: true })
      .exec();
    return account;
  }
}
