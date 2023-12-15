import { GetAccountByEmailRequest } from '@app/common/proto';
import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class GetAccountByEmailDto implements GetAccountByEmailRequest {
  @IsEmail()
  @IsNotEmpty()
  @Length(5, 50)
  email: string;
}
