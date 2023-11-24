import { UpdateRefreshTokenDto } from '../../dto/request/update-refresh-token.dto';

export class UpdateRefreshTokenCommand {
  constructor(public readonly requestDto: UpdateRefreshTokenDto) {}
}
