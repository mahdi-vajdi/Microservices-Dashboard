import { ChannelSettings } from './channel-settings';
import { Language } from './languages.enum';

export const DefaultChannelSettings: ChannelSettings = {
  main: {
    logo: 'uploads/channel-photos/channel-web.png',
    seeWhileTyping: false,
    sendVoice: true,
    showRaychatCredit: true,
    infoForm: {
      isEnabled: false,
      isOptional: true,
      type: 'name',
    },
  },
  widget: {
    landings: [
      {
        laguage: Language.PERSIAN,
        title: 'سیستم پشتیبانی آنلاین رایچت',
        description: 'توضیحات',
        startMessage: 'ارسال پیام برای ما',
        startReply: 'ما به زودی پاسخگوی شما هستیم',
      },
      {
        laguage: Language.ENGLISH,
        title: 'Raychat Customer Service',
        description: 'Description',
        startMessage: 'Ask us anything',
        startReply: 'We will reply to you as soon as possible!',
      },
    ],
    customization: {
      logo: 'uploads/channel-photos/widget-web.png',
      bgColor: '#841474',
      loBgColor: '#ffffff',
      secondaryColor: '#841474',
      bgTheme: 'default',
    },
    display: {
      showInPagesEnabled: false,
      showPages: [],
      hideInPagesEnabled: false,
      hideInPages: [],
    },
    position: {
      ltrPosition: 'bottom-right',
      ltrBottom: 15,
      ltrRight: 15,
      ltrShowInMobile: false,
      rtlPosition: 'bottom-left',
      rtlBottom: 15,
      rtlLeft: 15,
      rtlShowInMobile: false,
    },
  },
};
