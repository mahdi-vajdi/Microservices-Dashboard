import { InjectModel } from '@nestjs/mongoose';
import { User } from '../../Domain/entities/user.entity';
import { UserEntityRepository } from '../../Domain/base-user.entity-repo';
import { USER_DB_COLLECTION, UserModel } from '../models/user.model';
import { Model, Types } from 'mongoose';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserEntityRepositoryImpl implements UserEntityRepository {
  constructor(
    @InjectModel(USER_DB_COLLECTION)
    private readonly userModel: Model<UserModel>,
  ) {}

  async add(userEntity: User): Promise<User> {
    const newUser = await this.userModel.create(this.fromEntity(userEntity));

    return this.toEntity(newUser);
  }

  async save(user: User): Promise<void> {
    await this.userModel
      .findByIdAndUpdate(user.id, this.fromEntity(user), { lean: true })
      .exec();
  }

  async findOneById(id: string): Promise<User> {
    const user = await this.userModel.findById(id, {}, { lean: true }).exec();
    if (user) return this.toEntity(user);
    else throw new Error(`User with id: ${id} does'nt exist`);
  }

  private fromEntity(user: User): UserModel {
    return {
      _id: new Types.ObjectId(user.id),
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      password: user.password,
      refreshToken: user.refreshToken,
    };
  }

  private toEntity(model: UserModel): User {
    return new User(
      model._id.toHexString(),
      model.createdAt,
      model.updatedAt,
      model.firstName,
      model.lastName,
      model.email,
      model.phone,
      model.password,
      model.refreshToken,
    );
  }
}
