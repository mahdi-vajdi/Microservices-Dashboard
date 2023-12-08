import { IsNotEmpty, IsString } from 'class-validator';
import { AuthenticateAccessTokenMessage } from '../proto';

export class AuthenticateAccessTokenDto
  implements AuthenticateAccessTokenMessage
{
  @IsString()
  @IsNotEmpty()
  accessToken: string;
}
