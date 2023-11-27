import {
  IsEmail,
  IsEmpty,
  IsMobilePhone,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class CreateUserRequestDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  email: string;

  @IsMobilePhone()
  phone: string;

  @IsStrongPassword()
  password: string;

  @IsString()
  @IsEmpty()
  refreshToken: string;
}
