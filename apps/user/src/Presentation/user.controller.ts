import { Controller } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateUserDto } from '../Application/dto/request/create-user.dto';
import { CreateUserCommand } from '../Application/commands/impl/create-user.command';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserDto } from '@app/common';
import { UpdateRefreshTokenDto } from '../Application/dto/request/update-refresh-token.dto';
import { UpdateRefreshTokenCommand } from '../Application/commands/impl/update-refresh-token.command';
import { GetByIdDto } from '../Application/dto/request/get-by-id.dto';
import { GetByIdQuery } from '../Application/queries/impl/get-by-id.query';
import { GetByEmailQuery } from '../Application/queries/impl/get-by-email.query';
import { GetByEmailDto } from '../Application/dto/request/get-by-email.dto';
import { UserExistsDto } from '../Application/dto/request/user-exists.dto';
import { UserExistsQuery } from '../Application/queries/impl/user-exists-query';
import { ParseMongoIdPipe } from '@app/common/pipes/parse-objectId.pipe';

@Controller()
export class UserController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @MessagePattern('create')
  async createUser(@Payload() dto: CreateUserDto): Promise<UserDto> {
    return await this.commandBus.execute<CreateUserCommand, UserDto>(
      new CreateUserCommand(dto),
    );
  }

  @MessagePattern('updateRefreshToken')
  async updateRefreshToken(
    @Payload() { id, token }: UpdateRefreshTokenDto,
  ): Promise<void> {
    await this.commandBus.execute<UpdateRefreshTokenCommand, void>(
      new UpdateRefreshTokenCommand(id, token),
    );
  }

  @MessagePattern('userExists')
  async userExists(
    @Payload() { email, phone }: UserExistsDto,
  ): Promise<boolean> {
    return await this.queryBus.execute<UserExistsQuery, boolean>(
      new UserExistsQuery(email, phone),
    );
  }

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
