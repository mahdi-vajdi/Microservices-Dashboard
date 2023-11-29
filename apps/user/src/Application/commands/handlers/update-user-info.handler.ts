import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { UpdateUserInfoCommand } from '../impl/update-user-info.command';
import { UserEntityRepository } from 'apps/user/src/Domain/base-user.entity-repo';

@CommandHandler(UpdateUserInfoCommand)
export class UpdateUserInfoHandler
  implements ICommandHandler<UpdateUserInfoCommand, void>
{
  constructor(
    private readonly userRepo: UserEntityRepository,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute({ userId, dto }: UpdateUserInfoCommand): Promise<void> {
    const user = this.eventPublisher.mergeObjectContext(
      await this.userRepo.findOneById(userId),
    );
    if (!user) return;

    user.changeUserInfo(dto.firstName, dto.lastName, dto.phone);
    await this.userRepo.save(user);
    user.commit();
  }
}
