import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ACCOUNT_DB_COLLECTION, AccountModel } from '../models/account.model';
import { Model } from 'mongoose';
import { UserDto } from '@app/common';

@Injectable()
export class AccountQueryRepository {
  constructor(
    @InjectModel(ACCOUNT_DB_COLLECTION)
    private readonly userModel: Model<AccountModel>,
  ) {}
  async findOneById(id: string): Promise<UserDto> {
    const user = await this.userModel.findById(id, {}, { lean: true }).exec();
    // FIXME: handle the thwown error in higher classes
    if (!user) throw new Error(`User with id: ${id} does'nt exist`);
    return this.deSerialize(user);
  }

  async findOneByEmail(email: string): Promise<UserDto | null> {
    const user = await this.userModel
      .findOne({ email }, {}, { lean: true })
      .exec();
    if (user) return this.deSerialize(user);
    else return null;
  }

  async userExists(email: string, phone: string) {
    return this.userModel.exists({ $or: [{ email }, { phone }] }).exec();
  }

  private deSerialize(user: AccountModel): UserDto {
    return {
      id: user._id.toHexString(),
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      owner: user.owner.toHexString(),
    };
  }
}
