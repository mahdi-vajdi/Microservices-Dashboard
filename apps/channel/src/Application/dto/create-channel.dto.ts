import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreateChannelDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  url: string;

  @IsNotEmpty()
  @IsBoolean()
  addAllAgents: boolean;
}
