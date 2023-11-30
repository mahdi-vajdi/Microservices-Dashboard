import { IsMongoId } from 'class-validator';

export class GetAgentIdsDto {
  @IsMongoId()
  accountId: string;
}
