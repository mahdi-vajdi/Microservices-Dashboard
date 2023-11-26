import {
  IsArray,
  IsEmail,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { AgentRole } from '../../Domain/value-objects/agent-roles.enum';

export class CreateAgentDto {
  @IsEmail()
  email: string;

  @IsPhoneNumber()
  phone: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsStrongPassword()
  password: string;

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  channelIds: string[];

  @IsEnum(AgentRole)
  role: AgentRole;
}
