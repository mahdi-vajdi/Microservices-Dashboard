import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';
import {
  ChannelSettingsModel,
  ChannelSettingsSchema,
} from './channel-settings.model';

export const CHANNEL_DB_COLLECTION = 'channels';

export type ChannelDocument = HydratedDocument<ChannelModel>;

@Schema({ collection: CHANNEL_DB_COLLECTION, versionKey: false })
export class ChannelModel {
  @Prop({ type: SchemaTypes.ObjectId })
  _id: Types.ObjectId;

  @Prop({ type: Date, required: true })
  createdAt: Date;

  @Prop({ type: Date, required: true })
  updatedAt: Date;

  @Prop({ type: SchemaTypes.ObjectId, required: true })
  owner: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  url: string;

  @Prop({ required: true })
  token: string;

  @Prop({ required: true })
  isEnabled: boolean;

  @Prop({
    type: [{ type: SchemaTypes.ObjectId }],
    required: true,
  })
  agents: Types.ObjectId[];

  @Prop({ type: ChannelSettingsSchema, required: true })
  settings: ChannelSettingsModel;
}

export const ChannelSchema = SchemaFactory.createForClass(ChannelModel);
