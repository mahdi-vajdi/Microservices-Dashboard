import {
  IsArray,
  IsEmail,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
  Length,
} from 'class-validator';
import { AgentRole } from '../../Domain/value-objects/agent-roles.enum';

export class CreateAgentDto {
  @IsEmail()
  @Length(5, 50)
  email: string;

  @IsPhoneNumber()
  phone: string;

  @IsString()
  @IsNotEmpty()
  @Length(3, 30)
  title: string;

  @IsString()
  @IsNotEmpty()
  @Length(3, 30)
  name: string;

  @IsStrongPassword()
  @Length(8, 20)
  password: string;

  @IsArray()
  @IsMongoId({ each: true })
  channelIds: string[];

  @IsEnum(AgentRole)
  role: AgentRole;
}
