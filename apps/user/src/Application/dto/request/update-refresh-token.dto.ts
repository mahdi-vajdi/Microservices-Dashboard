import { IsMongoId, IsOptional } from 'class-validator';

export class UpdateRefreshTokenDto {
  @IsMongoId()
  id: string;

  @IsOptional()
  token: string | null;
}
