import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import * as mongoose from 'mongoose';

@Injectable()
export class ParseMongoIdPipe implements PipeTransform<string> {
  async transform(value: string, metadata: ArgumentMetadata) {
    const isValid = mongoose.Types.ObjectId.isValid(value);
    if (!isValid)
      throw new BadRequestException(
        `Value of ${metadata.type}:${metadata.data} need to be a MongoDB Id.`,
      );

    return value;
  }
}
