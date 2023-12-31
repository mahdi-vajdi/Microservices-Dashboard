import { AgentRole } from '@app/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, SchemaTypes, HydratedDocument } from 'mongoose';

export type AgentDocument = HydratedDocument<AgentModel>;

@Schema({ collection: 'agents', versionKey: false })
export class AgentModel {
  @Prop({ type: SchemaTypes.ObjectId })
  _id: Types.ObjectId;

  @Prop({ type: Date, required: true })
  createdAt: Date;

  @Prop({ type: Date, required: true })
  updatedAt: Date;

  @Prop({ type: SchemaTypes.ObjectId, required: true })
  account: Types.ObjectId;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: SchemaTypes.String, default: null })
  refreshToken: string | null;

  @Prop({
    type: String,
    enum: Object.values(AgentRole),
    required: true,
  })
  role: AgentRole;

  @Prop({ required: true })
  avatar: string;

  @Prop({ required: true })
  online: boolean;
}

export const AgentSchema = SchemaFactory.createForClass(AgentModel);
