import { Controller } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateAccountDto } from '../Application/dto/create-account.dto';
import { CreateAccountCommand } from '../Application/commands/impl/create-account.command';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { GetByIdQuery } from '../Application/queries/impl/get-by-id.query';
import { GetByIdDto } from '../Application/dto/get-by-id.dto';
import { AccountModel } from '../Infrastructure/models/account.model';
import { AccountDto } from '@app/common/dto/account.dto';

@Controller()
export class NatsAccountController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @MessagePattern('createAccount')
  async createAccount(
    @Payload() { owner }: CreateAccountDto,
  ): Promise<AccountDto> {
    return await this.commandBus.execute<CreateAccountCommand, AccountDto>(
      new CreateAccountCommand(owner),
    );
  }

  @MessagePattern('getAccountById')
  async getById(@Payload() { id }: GetByIdDto): Promise<AccountModel> {
    return this.queryBus.execute<GetByIdQuery, AccountModel>(
      new GetByIdQuery(id),
    );
  }
}
