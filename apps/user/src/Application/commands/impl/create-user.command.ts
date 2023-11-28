import { CreateUserDto } from '../../dto/request/create-user.dto';

export class CreateUserCommand {
  constructor(public readonly createUserRequest: CreateUserDto) {}
}
