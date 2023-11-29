import { IsMongoId, IsNotEmpty } from 'class-validator';

export class CreateAccountDto {
  @IsMongoId()
  @IsNotEmpty()
  owner: string;
}
