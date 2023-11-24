import { Controller } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateUserRequestDto } from '../Application/dto/request/create-user-request.dto';
import { CreateUserCommand } from '../Application/commands/impl/create-user.command';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserDto } from '@app/common';
import { UpdateRefreshTokenDto } from '../Application/dto/request/update-refresh-token.dto';
import { UpdateRefreshTokenCommand } from '../Application/commands/impl/update-refresh-token.command';

@Controller()
export class UserController {
  constructor(private readonly commandBus: CommandBus) {}

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
    this.commandBus.execute<UpdateRefreshTokenCommand, void>(
      new UpdateRefreshTokenCommand(dto),
    );
  }
}
