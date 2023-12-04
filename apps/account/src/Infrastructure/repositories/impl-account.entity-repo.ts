import { InjectModel } from '@nestjs/mongoose';
import { Account } from '../../Domain/entities/account.entity';
import { AccountEntityRepository } from '../../Domain/base-account.entity-repo';
import { ACCOUNT_DB_COLLECTION, AccountModel } from '../models/account.model';
import { Model, Types } from 'mongoose';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AccountEntityRepositoryImpl implements AccountEntityRepository {
  constructor(
    @InjectModel(ACCOUNT_DB_COLLECTION)
    private readonly accountModel: Model<AccountModel>,
  ) {}

  async add(accountEntity: Account): Promise<void> {
    const newAccount = await this.accountModel.create(
      this.fromEntity(accountEntity),
    );
    console.log('created account: ', JSON.stringify(newAccount));
  }

  async save(account: Account): Promise<void> {
    await this.accountModel
      .findByIdAndUpdate(account.id, this.fromEntity(account), { lean: true })
      .exec();
  }

  async findOneById(id: string): Promise<Account> {
    const account = await this.accountModel
      .findById(id, {}, { lean: true })
      .exec();
    if (account) return this.toEntity(account);
    else throw new Error(`Account with id: ${id} does'nt exist`);
  }

  private fromEntity(account: Account): AccountModel {
    return {
      _id: new Types.ObjectId(account.id),
      createdAt: account.createdAt,
      updatedAt: account.updatedAt,
      email: account.email,
    };
  }

  private toEntity(model: AccountModel): Account {
    return new Account(
      model._id.toHexString(),
      model.createdAt,
      model.updatedAt,
      model.email,
    );
  }
}
