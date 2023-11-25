import { Controller } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateUserRequestDto } from '../Application/dto/request/create-user-request.dto';
import { CreateUserCommand } from '../Application/commands/impl/create-user.command';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserDto } from '@app/common';
import { UpdateRefreshTokenDto } from '../Application/dto/request/update-refresh-token.dto';
import { UpdateRefreshTokenCommand } from '../Application/commands/impl/update-refresh-token.command';
import { GetByIdDto } from '../Application/dto/request/get-by-id.dto';
import { GetByIdQuery } from '../Application/queries/impl/find-by-id.query';

@Controller()
export class UserController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @MessagePattern('create')
  async createUser(@Payload() dto: CreateUserRequestDto): Promise<UserDto> {
    return await this.commandBus.execute<CreateUserCommand, UserDto>(
      new CreateUserCommand(dto),
    );
  }

  @MessagePattern('updateRefreshToken')
  async updateRefreshToken(
    @Payload() dto: UpdateRefreshTokenDto,
  ): Promise<void> {
    await this.commandBus.execute<UpdateRefreshTokenCommand, void>(
      new UpdateRefreshTokenCommand(dto),
    );
  }

  @MessagePattern('getById')
  async getById(@Payload() { id }: GetByIdDto): Promise<UserDto> {
    return this.queryBus.execute<GetByIdQuery, UserDto>(new GetByIdQuery(id));
  }
}
