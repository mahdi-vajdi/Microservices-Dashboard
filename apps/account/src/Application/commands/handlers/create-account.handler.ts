import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { CreateAccountCommand } from '../impl/create-account.command';
import { Types } from 'mongoose';
import { AccountEntityRepository } from 'apps/account/src/Domain/base-account.entity-repo';
import { Account } from 'apps/account/src/Domain/entities/account.entity';
@CommandHandler(CreateAccountCommand)
export class CreateAccountHandler
  implements ICommandHandler<CreateAccountCommand, void>
{
  constructor(
    private readonly accountRepository: AccountEntityRepository,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute({ email }: CreateAccountCommand): Promise<void> {
    const account = this.eventPublisher.mergeObjectContext(
      Account.create(new Types.ObjectId().toHexString(), email),
    );

    await this.accountRepository.add(account);
    account.commit();
  }
}
