import { IsEmail, Length } from 'class-validator';

export class GetByEmailDto {
  @Length(5, 50)
  @IsEmail()
  email: string;
}
