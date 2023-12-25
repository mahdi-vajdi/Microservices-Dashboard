export interface ChannelMessage {
  id: string;
  created_at: string;
  updated_at: string;
  account: string;
  title: string;
  url: string;
  token: string;
  is_enabled: boolean;
  agents: string[];
  channel_settings: ChannelSettingsMessage;
}

export interface ChannelSettingsMessage {
  Main: {
    logo: string;
    see_while_typing: boolean;
    send_voice: boolean;
    show_raychat_credit: boolean;
    InfoForm: {
      is_enabled: boolean;
      is_optional: boolean;
      type: string;
    };
  };

  WidgetLandings: {
    laguage: string;
    title: string;
    description: string;
    start_message: string;
    start_reply: string;
  }[];

  WidgetCustomization: {
    logo: string;
    bg_color: string;
    lo_bg_color: string;
    secondary_color: string;
    bgbg_themeTheme: string;
  };

  WidgetDisplay: {
    show_in_pages_enabled: boolean;
    show_pages: string[];
    hide_in_pages_enabled: boolean;
    hide_in_pages: string[];
  };

  WidgetPosition: {
    ltr_position: string;
    ltr_bottom: number;
    ltr_right: number;
    ltr_show_in_mobile: boolean;
    rtl_position: string;
    rtl_bottom: number;
    rtl_left: number;
    rtl_show_in_mobile: boolean;
  };
}
