import { IsMongoId, IsNotEmpty } from 'class-validator';

export class SignoutDto {
  @IsMongoId()
  @IsNotEmpty()
  agentId: string;
}
