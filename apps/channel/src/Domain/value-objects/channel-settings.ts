export class ChannelSettings {
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

  widgetLandings: {
    laguage: string;
    title: string;
    description: string;
    startMessage: string;
    startReply: string;
  }[];

  widgetCustomization: {
    logo: string;
    bgColor: string;
    loBgColor: string;
    secondaryColor: string;
    bgTheme: string;
  };

  widgetDisplay: {
    showInPagesEnabled: boolean;
    showPages: string[];
    hideInPagesEnabled: boolean;
    hideInPages: string[];
  };

  widgetPosition: {
    ltrPosition: string;
    ltrBottom: number;
    ltrRight: number;
    ltrShowInMobile: boolean;
    rtlPosition: string;
    rtlBottom: number;
    rtlLeft: number;
    rtlShowInMobile: boolean;
  };

  // FIXME: office hours, email settings, triggers need to be added
}
