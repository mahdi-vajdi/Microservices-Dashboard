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
  constructor(
    @InjectModel(ACCOUNT_DB_COLLECTION)
    private readonly accountModel: Model<AccountModel>,
  ) {}

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
