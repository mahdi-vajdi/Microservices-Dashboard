import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';

@Schema({ _id: false, versionKey: false })
export class ContainerSettingsModel {
  @Prop({ type: SchemaTypes.Mixed, required: true })
  main: {
    logo: string;
    seeWhileTyping: boolean;
    sendVoice: boolean;
    showRaychatCredit: boolean;
    infoForm: {
      isEnabled: boolean;
      isOptional: boolean;
      type: string;
    };
  };

  @Prop({ type: SchemaTypes.Mixed, required: true })
  widget: {
    landings: {
      laguage: string;
      title: string;
      description: string;
      startMessage: string;
      startReply: string;
    }[];

    customization: {
      logo: string;
      bgColor: string;
      loBgColor: string;
      secondaryColor: string;
      bgTheme: string;
    };

    display: {
      showInPagesEnabled: boolean;
      showPages: string[];
      hideInPagesEnabled: boolean;
      hideInPages: string[];
    };

    position: {
      ltrPosition: string;
      ltrBottom: number;
      ltrRight: number;
      ltrShowInMobile: boolean;
      rtlPosition: string;
      rtlBottom: number;
      rtlLeft: number;
      rtlShowInMobile: boolean;
    };
  };

  // FIXME: office hours, email settings, triggers need to be added
}

export const ContainerSettingsSchema = SchemaFactory.createForClass(
  ContainerSettingsModel,
);
