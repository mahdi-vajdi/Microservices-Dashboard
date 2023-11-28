import { IsMongoId } from 'class-validator';

export class GetAgentIdsDto {
  @IsMongoId()
  id: string;
}
