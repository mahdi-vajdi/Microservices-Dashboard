import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class GetByEmailDto {
  @IsEmail()
  @IsNotEmpty()
  @Length(5, 50)
  email: string;
}
