import { Controller } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateAccountDto } from '../Application/dto/create-account.dto';
import { CreateAccountCommand } from '../Application/commands/impl/create-account.command';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { GetByIdQuery } from '../Application/queries/impl/get-by-id.query';
import { GetByIdDto } from '../Application/dto/get-by-id.dto';
import { AccountDto } from '@app/common/dto/account.dto';
import { GetByEmailDto } from '../Application/dto/get-by-email.dto';
import { GetByEmailQuery } from '../Application/queries/impl/get-by-email.query';
import { AccountExistsQuery } from '../Application/queries/impl/account-exists.query';

@Controller()
export class NatsAccountController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @EventPattern('createAccount')
  async createAccount(@Payload() { email }: CreateAccountDto): Promise<void> {
    await this.commandBus.execute<CreateAccountCommand, void>(
      new CreateAccountCommand(email),
    );
    console.debug('account created');
    return;
  }

  @MessagePattern('getAccountById')
  async getById(@Payload() { id }: GetByIdDto): Promise<AccountDto | null> {
    return this.queryBus.execute<GetByIdQuery, AccountDto | null>(
      new GetByIdQuery(id),
    );
  }

  @MessagePattern('getAccountByEmail')
  async getByEmail(
    @Payload() { email }: GetByEmailDto,
  ): Promise<AccountDto | null> {
    return await this.queryBus.execute<GetByEmailQuery, AccountDto | null>(
      new GetByEmailQuery(email),
    );
  }

  @MessagePattern('accountExists')
  async accountExists(@Payload() { email }: GetByEmailDto): Promise<boolean> {
    return await this.queryBus.execute<AccountExistsQuery, boolean>(
      new AccountExistsQuery(email),
    );
  }
}
