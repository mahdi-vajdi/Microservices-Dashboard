import { IsEmail, IsNotEmpty, IsPhoneNumber, Length } from 'class-validator';

export class UserExistsDto {
  @IsNotEmpty()
  @Length(3, 50)
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Length(5)
  @IsPhoneNumber()
  phone: string;
}
