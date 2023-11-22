import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateUserRequestDto } from '../Application/dto/request/create-user-request.dto';
import { CreateUserCommand } from '../Application/commands/impl/create-user.command';

@Controller()
export class UserController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  async createUser(
    @Body() createUserRequestDto: CreateUserRequestDto,
  ): Promise<void> {
    await this.commandBus.execute<CreateUserCommand, void>(
      new CreateUserCommand(createUserRequestDto),
    );
  }
}
