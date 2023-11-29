import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { CreateAccountCommand } from '../impl/create-account.command';
import { Types } from 'mongoose';
import { UserDto } from '@app/common';
import { AccountEntityRepository } from 'apps/account/src/Domain/base-account.entity-repo';
import { Account } from 'apps/account/src/Domain/entities/account.entity';

@CommandHandler(CreateAccountCommand)
export class CreateAccountHandler
  implements ICommandHandler<CreateAccountCommand, UserDto>
{
  constructor(
    private readonly accountRepository: AccountEntityRepository,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute({ dto }: CreateAccountCommand): Promise<UserDto> {
    const account = this.eventPublisher.mergeObjectContext(
      Account.create(new Types.ObjectId().toHexString(), dto.owner),
    );
    await this.accountRepository.add(account);
    account.commit();
    return this.toAccountDto(account);
  }

  private toAccountDto(account: Account): UserDto {
    return {
      id: account.id,
      createdAt: account.createdAt,
      updatedAt: account.updatedAt,
      owner: account.owner,
    };
  }
}
