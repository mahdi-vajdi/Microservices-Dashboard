import {
  IsEmail,
  IsMongoId,
  IsNotEmpty,
  IsPhoneNumber,
  Length,
} from 'class-validator';

export class AgentExistsDto {
  @IsMongoId()
  @IsEmail()
  @Length(5, 50)
  email: string;

  @IsPhoneNumber()
  @IsNotEmpty()
  phone: string;
}
