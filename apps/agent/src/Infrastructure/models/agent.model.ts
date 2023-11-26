import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, SchemaTypes, HydratedDocument } from 'mongoose';
import { AgentRole } from '../../Domain/value-objects/agent-roles.enum';

export type AgentDocument = HydratedDocument<AgentModel>;

@Schema({ collection: 'agents', versionKey: false })
export class AgentModel {
  @Prop({ type: SchemaTypes.ObjectId })
  _id: Types.ObjectId;

  @Prop({ type: Date, required: true })
  createdAt: Date;

  @Prop({ type: Date, required: true })
  updatedAt: Date;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  avatar: string;

  @Prop({ required: true })
  online: boolean;

  @Prop({ type: SchemaTypes.ObjectId, required: true })
  admin: Types.ObjectId;

  @Prop({
    type: String,
    enum: Object.values(AgentRole),
    required: true,
  })
  role: AgentRole;
}

export const AgentSchema = SchemaFactory.createForClass(AgentModel);
