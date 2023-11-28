import { IsArray, IsMongoId } from 'class-validator';

export class UpdateChannelAgentsDto {
  @IsArray()
  @IsMongoId({ each: true })
  agents: string[];
}
