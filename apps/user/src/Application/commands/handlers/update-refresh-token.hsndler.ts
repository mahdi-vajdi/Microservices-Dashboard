import { ICommandHandler } from '@nestjs/cqrs';
import { UpdateRefreshTokenCommand } from '../impl/update-refresh-token.command';
import { UserRepository } from 'apps/user/src/Domain/abstract-user.repo';

export class UpdateRefreshTokenHandler
  implements ICommandHandler<UpdateRefreshTokenCommand, void>
{
  constructor(private readonly userRepo: UserRepository) {}

  async execute(command: UpdateRefreshTokenCommand): Promise<void> {
    const { id, token } = command.requestDto;

    const user = await this.userRepo.findOneById(id);
    if (user) user.changeRefreshToken(token);

    await this.userRepo.save(user);
    user.commit();
  }
}
