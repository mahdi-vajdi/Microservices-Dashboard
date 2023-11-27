import { IsEmail, IsNotEmpty, IsPhoneNumber } from 'class-validator';

export class UserExistsDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsPhoneNumber()
  phone: string;
}
