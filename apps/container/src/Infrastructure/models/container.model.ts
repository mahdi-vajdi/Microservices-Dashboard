import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';
import {
  ContainerSettingsModel,
  ContainerSettingsSchema,
} from './container-settings.model';

export type ContainerDocument = HydratedDocument<ContainerModel>;

@Schema({ versionKey: false })
export class ContainerModel {
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
    type: [{ type: SchemaTypes.ObjectId, ref: 'AgentDO' }],
    required: true,
  })
  agents: Types.ObjectId[];

  // @Prop({ type: ContainerSettingsSchema, required: true })
  // settings: ContainerSettingsModel;
}

export const ContainersSchema = SchemaFactory.createForClass(ContainerModel);
