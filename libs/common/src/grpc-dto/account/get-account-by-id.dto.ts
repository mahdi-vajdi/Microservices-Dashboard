import { GetAccountByIdRequest } from '@app/common/proto';
import { IsMongoId, IsNotEmpty } from 'class-validator';

export class GetAccountByIdDto implements GetAccountByIdRequest {
  @IsMongoId()
  @IsNotEmpty()
  id: string;
}
