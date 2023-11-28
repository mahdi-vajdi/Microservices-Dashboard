import { IsMongoId, IsOptional, Length } from 'class-validator';

export class UpdateRefreshTokenDto {
  @IsMongoId()
  id: string;

  @Length(3)
  @IsOptional()
  token: string | null;
}
