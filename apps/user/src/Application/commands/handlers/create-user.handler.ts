import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from '../impl/create-user.command';
import { Types } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { UserFactory } from 'apps/user/src/Domain/user.factory';
import { UserRepository } from 'apps/user/src/Domain/abstract-user.repo';
import { UserDto } from '@app/common';
import { User } from 'apps/user/src/Domain/user.domain';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler
  implements ICommandHandler<CreateUserCommand, UserDto>
{
  constructor(
    private readonly userFactory: UserFactory,
    private readonly userRepository: UserRepository,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute({ createUserRequest }: CreateUserCommand): Promise<UserDto> {
    const { firstName, lastName, email, phone, password, refreshToken } =
      createUserRequest;
    const user = this.eventPublisher.mergeObjectContext(
      this.userFactory.create(
        new Types.ObjectId().toHexString(),
        firstName,
        lastName,
        email,
        phone,
        await bcrypt.hash(password, 10),
        refreshToken,
      ),
    );
    await this.userRepository.add(user);
    user.commit();
    return this.toUserDto(user);
  }

  private toUserDto(user: User): UserDto {
    return {
      id: user.id,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      password: user.password,
      refreshToken: null,
    };
  }
}
