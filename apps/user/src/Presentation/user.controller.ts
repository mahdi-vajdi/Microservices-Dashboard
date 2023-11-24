import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateUserRequestDto } from '../Application/dto/request/create-user-request.dto';
import { CreateUserCommand } from '../Application/commands/impl/create-user.command';
import { MessagePattern } from '@nestjs/microservices';
import { UserDto } from '@app/common';

@Controller()
export class UserController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  @MessagePattern('create')
  async createUser(
    @Body() createUserRequestDto: CreateUserRequestDto,
  ): Promise<UserDto> {
    return await this.commandBus.execute<CreateUserCommand, UserDto>(
      new CreateUserCommand(createUserRequestDto),
    );
  }
}
