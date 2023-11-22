import { CreateUserRequestDto } from '../../dto/request/create-user-request.dto';

export class CreateUserCommand {
  constructor(public readonly createUserRequest: CreateUserRequestDto) {}
}
