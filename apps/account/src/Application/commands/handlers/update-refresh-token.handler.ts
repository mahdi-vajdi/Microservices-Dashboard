import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateRefreshTokenCommand } from '../impl/update-refresh-token.command';
import { AccountEntityRepository } from 'apps/user/src/Domain/base-user.entity-repo';

@CommandHandler(UpdateRefreshTokenCommand)
export class UpdateRefreshTokenHandler
  implements ICommandHandler<UpdateRefreshTokenCommand, void>
{
  constructor(private readonly userRepo: AccountEntityRepository) {}

  async execute(command: UpdateRefreshTokenCommand): Promise<void> {
    const user = await this.userRepo.findOneById(command.userId);
    if (!user) return;

    // const hashedToken =
    //   command.token !== null ? await bcrypt.hash(command.token, 10) : null;

    user.changeRefreshToken(command.token);
    await this.userRepo.save(user);
    user.commit();
  }
}
