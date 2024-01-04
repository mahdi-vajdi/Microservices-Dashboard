import { IsMongoId, IsNotEmpty, IsString, Length } from 'class-validator';

export class RefreshTokensDto {
  @IsMongoId()
  @IsNotEmpty()
  agentId: string;

  @IsString()
  @IsNotEmpty()
  @Length(5)
  refreshToken: string;
}
