import { UpdateUserInfoDto } from '../../dto/request/update-user-info.dto';

export class UpdateUserInfoCommand {
  constructor(
    public readonly userId: string,
    public readonly dto: UpdateUserInfoDto,
  ) {}
}
