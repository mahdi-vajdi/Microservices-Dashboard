import { IsMongoId } from 'class-validator';

export class GetByIdDto {
  @IsMongoId()
  id: string;
}
