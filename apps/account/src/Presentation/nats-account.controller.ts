import { Controller } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateAccountDto } from '../Application/dto/create-account.dto';
import { CreateAccountCommand } from '../Application/commands/impl/create-account.command';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { GetByIdQuery } from '../Application/queries/impl/get-by-id.query';
import { GetByIdDto } from '../Application/dto/get-by-id.dto';
import { AccountModel } from '../Infrastructure/models/account.model';

@Controller()
export class NatsAccountController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @MessagePattern('create')
  async createAccount(@Payload() dto: CreateAccountDto): Promise<void> {
    return await this.commandBus.execute<CreateAccountCommand, void>(
      new CreateAccountCommand(dto),
    );
  }

  @MessagePattern('getAccountById')
  async getById(@Payload() { id }: GetByIdDto): Promise<AccountModel> {
    return this.queryBus.execute<GetByIdQuery, AccountModel>(
      new GetByIdQuery(id),
    );
  }
}
