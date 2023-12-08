import { IsNotEmpty, IsString } from 'class-validator';
import { AuthenticateRefreshTokenMessage } from '../proto';

export class AuthenticateRefreshTokenDto
  implements AuthenticateRefreshTokenMessage
{
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
