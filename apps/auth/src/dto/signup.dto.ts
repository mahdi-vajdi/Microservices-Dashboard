import {
  IsEmail,
  IsMobilePhone,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  Length,
} from 'class-validator';

export class SignupDto {
  @Length(3, 30)
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @Length(3, 30)
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @Length(5, 50)
  @IsEmail()
  email: string;

  @IsMobilePhone()
  phone: string;

  @Length(8, 20)
  @IsStrongPassword()
  password: string;
}
