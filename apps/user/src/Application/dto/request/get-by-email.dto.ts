import { IsEmail } from 'class-validator';

export class GetByEmailDto {
  @IsEmail()
  email: string;
}
