import {
  IsEmail,
  IsEmpty,
  IsMobilePhone,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  Length,
} from 'class-validator';

export class CreateUserDto {
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

  @IsStrongPassword()
  password: string;

  @Length(3)
  @IsString()
  @IsEmpty()
  refreshToken: string;
}
