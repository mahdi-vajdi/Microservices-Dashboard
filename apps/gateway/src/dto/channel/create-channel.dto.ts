import { IsBoolean, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateChannelDto {
  @IsNotEmpty()
  @IsString()
  @Length(4, 40)
  title: string;

  @IsNotEmpty()
  @IsString()
  @Length(4, 50)
  url: string;

  @IsNotEmpty()
  @IsBoolean()
  addAllAgents: boolean;
}
