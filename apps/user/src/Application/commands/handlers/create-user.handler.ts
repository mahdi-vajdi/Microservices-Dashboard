import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from '../impl/create-user.command';
import { Types } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { UserFactory } from 'apps/user/src/Domain/user.factory';
import { UserRepository } from 'apps/user/src/Domain/user-repo.abstract';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    private readonly userFactory: UserFactory,
    private readonly userRepository: UserRepository,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute({ createUserRequest }: CreateUserCommand): Promise<void> {
    const { firstName, lastName, email, phone, role, password, refreshToken } =
      createUserRequest;
    const user = this.eventPublisher.mergeObjectContext(
      this.userFactory.create(
        new Types.ObjectId().toHexString(),
        firstName,
        lastName,
        email,
        phone,
        role,
        await bcrypt.hash(password, 10),
        refreshToken,
      ),
    );
    await this.userRepository.save(user);
    user.commit();
  }
}
