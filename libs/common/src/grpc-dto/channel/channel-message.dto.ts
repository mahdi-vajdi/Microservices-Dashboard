export interface ChannelMessage {
  id: string;
  createdAt: string;
  updatedAt: string;
  account: string;
  title: string;
  url: string;
  token: string;
  isEnabled: boolean;
  agents: string[];
  channelSettings: ChannelSettingsMessage;
}

export interface ChannelSettingsMessage {
  Main: {
    logo: string;
    seeWhileTyping: boolean;
    sendVoice: boolean;
    showRaychatCredit: boolean;
    InfoForm: {
      isEnabled: boolean;
      isOptional: boolean;
      type: string;
    };
  };

  WidgetLandings: {
    laguage: string;
    title: string;
    description: string;
    startMessage: string;
    startReply: string;
  }[];

  WidgetCustomization: {
    logo: string;
    bgColor: string;
    loBgColor: string;
    secondaryColor: string;
    bgTheme: string;
  };

  WidgetDisplay: {
    showInPagesEnabled: boolean;
    showPages: string[];
    hideInPagesEnabled: boolean;
    hideInPages: string[];
  };

  WidgetPosition: {
    ltrPosition: string;
    ltrBottom: number;
    ltrRight: number;
    ltrShowInMobile: boolean;
    rtlPosition: string;
    rtlBottom: number;
    rtlLeft: number;
    rtlShowInMobile: boolean;
  };
}
