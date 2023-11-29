import { Controller } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateAccountDto } from '../Application/dto/create-account.dto';
import { CreateAccountCommand } from '../Application/commands/impl/create-account.command';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserDto } from '@app/common';
import { GetByIdQuery } from '../Application/queries/impl/get-by-id.query';
import { GetByEmailQuery } from '../Application/queries/impl/get-by-email.query';
import { ParseMongoIdPipe } from '@app/common/pipes/parse-objectId.pipe';

@Controller()
export class NatsAccountController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @MessagePattern('create')
  async createAccount(@Payload() dto: CreateAccountDto): Promise<UserDto> {
    return await this.commandBus.execute<CreateAccountCommand, UserDto>(
      new CreateAccountCommand(dto),
    );
  }

  // @EventPattern('updateRefreshToken')
  // async updateRefreshToken(
  //   @Payload() { id, token }: UpdateRefreshTokenDto,
  // ): Promise<void> {
  //   await this.commandBus.execute<UpdateRefreshTokenCommand, void>(
  //     new UpdateRefreshTokenCommand(id, token),
  //   );
  // }

  // @MessagePattern('accountExists')
  // async accountExists(
  //   @Payload() { email, phone }: UserExistsDto,
  // ): Promise<boolean> {
  //   return await this.queryBus.execute<UserExistsQuery, boolean>(
  //     new UserExistsQuery(email, phone),
  //   );
  // }

  @MessagePattern('getById')
  async getById(
    @Payload(ParseMongoIdPipe) { id }: GetByIdDto,
  ): Promise<UserDto> {
    return this.queryBus.execute<GetByIdQuery, UserDto>(new GetByIdQuery(id));
  }

  @MessagePattern('getByEmail')
  async getByEmail(
    @Payload() { email }: GetByEmailDto,
  ): Promise<UserDto | null> {
    return this.queryBus.execute<GetByEmailQuery, UserDto | null>(
      new GetByEmailQuery(email),
    );
  }
}
