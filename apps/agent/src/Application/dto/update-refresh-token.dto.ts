import { IsMongoId, IsOptional, Length } from 'class-validator';

export class UpdateRefreshTokenDto {
  @IsMongoId()
  agentId: string;

  @Length(3)
  @IsOptional()
  newToken: string | null;
}
