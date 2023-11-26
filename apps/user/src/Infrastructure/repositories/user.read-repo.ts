import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { USER_DB_COLLECTION, UserModel } from '../models/user.model';
import { Model } from 'mongoose';
import { UserResponseDto } from '../../Application/dto/response/user-response.dto';
import { UserDto } from '@app/common';

@Injectable()
export class UserReadRepository {
  constructor(
    @InjectModel(USER_DB_COLLECTION)
    private readonly userModel: Model<UserModel>,
  ) {}
  async findOneById(id: string): Promise<UserResponseDto> {
    const user = await this.userModel.findById(id, {}, { lean: true }).exec();
    // FIXME: handle the thwown error in higher classes
    if (!user) throw new Error(`User with id: ${id} does'nt exist`);
    return this.deSerialize(user);
  }

  async findOneByEmail(email: string): Promise<UserResponseDto> {
    const user = await this.userModel
      .findOne({ email }, {}, { lean: true })
      .exec();
    if (!user) throw new Error(`User with email: ${email} does'nt exist`);
    return this.deSerialize(user);
  }

  deSerialize(user: UserModel): UserDto {
    return {
      id: user._id.toHexString(),
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      password: user.password,
      refreshToken: user.refreshToken,
    };
  }
}
