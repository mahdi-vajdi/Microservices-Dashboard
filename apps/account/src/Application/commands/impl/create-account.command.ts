import { CreateAccountDto } from '../../dto/create-account.dto';

export class CreateAccountCommand {
  constructor(public readonly dto: CreateAccountDto) {}
}
