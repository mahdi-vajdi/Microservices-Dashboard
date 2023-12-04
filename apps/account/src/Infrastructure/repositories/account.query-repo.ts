import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ACCOUNT_DB_COLLECTION, AccountModel } from '../models/account.model';
import { Model } from 'mongoose';
import { AccountDto } from '@app/common/dto/account.dto';

@Injectable()
export class AccountQueryRepository {
  constructor(
    @InjectModel(ACCOUNT_DB_COLLECTION)
    private readonly account: Model<AccountModel>,
  ) {}
  async findOneById(id: string): Promise<AccountDto | null> {
    const account = await this.account.findById(id, {}, { lean: true }).exec();
    if (account) return this.toDto(account);
    else return null;
  }

  async findOneByEmail(email: string): Promise<AccountDto | null> {
    const account = await this.account
      .findOne({ email }, {}, { lean: true })
      .exec();
    if (account) return this.toDto(account);
    else return null;
  }

  private toDto(model: AccountModel): AccountDto {
    return {
      id: model._id.toHexString(),
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
      email: model.email,
    };
  }
}
