import { IsJWT, IsMongoId, IsOptional } from 'class-validator';

export class UpdateRefreshTokenDto {
  @IsMongoId()
  id: string;

  @IsOptional()
  @IsJWT()
  token: string | null;
}
