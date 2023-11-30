import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';

export type AccountDocument = HydratedDocument<AccountModel>;

export const ACCOUNT_DB_COLLECTION = 'accounts';

@Schema({ collection: ACCOUNT_DB_COLLECTION, versionKey: false })
export class AccountModel {
  @Prop({ type: SchemaTypes.ObjectId })
  _id: Types.ObjectId;

  @Prop({ type: Date, required: true })
  createdAt: Date;

  @Prop({ type: Date, required: true })
  updatedAt: Date;

  @Prop({ type: SchemaTypes.ObjectId, required: true })
  email: Types.ObjectId;
}

export const AccountSchema = SchemaFactory.createForClass(AccountModel);
