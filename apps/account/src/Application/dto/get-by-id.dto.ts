import { IsMongoId, IsNotEmpty } from 'class-validator';

export class GetByIdDto {
  @IsMongoId()
  @IsNotEmpty()
  id: string;
}
