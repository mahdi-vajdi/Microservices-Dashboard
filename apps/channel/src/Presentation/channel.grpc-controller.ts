import {
  ChannelMessage,
  ChannelMessageResponse,
  ChannelsMessageResponse,
  GetAccountChannelsRequest,
  GetChannelByIdRequest,
} from '@app/common';
import { Metadata, ServerUnaryCall } from '@grpc/grpc-js';
import { QueryBus } from '@nestjs/cqrs';
import { GrpcMethod } from '@nestjs/microservices';
import { ChannelModel } from '../Infrastructure/models/channel.model';
import { GetAccountChannelsQuery } from '../Application/queries/impl/get-account-cahnnels.query';
import { GetByIdQuery } from '../Application/queries/impl/get-by-id.query';

export class ChannelGrpcController {
  constructor(private readonly queryBus: QueryBus) {}

  // @Roles(AgentRole.OWNER, AgentRole.ADMIN)
  @GrpcMethod('AccountService', 'GetAccountById')
  async getAccountChannels(
    data: GetAccountChannelsRequest,
    metadata: Metadata,
    call: ServerUnaryCall<any, any>,
  ): Promise<ChannelsMessageResponse> {
    const channels = await this.queryBus.execute<
      GetAccountChannelsQuery,
      ChannelModel[] | null
    >(new GetAccountChannelsQuery(data.account_id));

    if (channels)
      return { channels: channels.map((channel) => this.toGrpcModel(channel)) };
    else return { channels: undefined };
  }

  // @Roles(AgentRole.OWNER, AgentRole.ADMIN)
  @GrpcMethod('AccountService', 'GetAccountByEmail')
  async getById(
    data: GetChannelByIdRequest,
    metadata: Metadata,
    call: ServerUnaryCall<any, any>,
  ): Promise<ChannelMessageResponse> {
    const channel = await this.queryBus.execute<GetByIdQuery, ChannelModel>(
      new GetByIdQuery(data.user_id, data.channel_id),
    );

    if (channel) return { channel: this.toGrpcModel(channel) };
    else return { channel: undefined };
  }

  private toGrpcModel(channel: ChannelModel): ChannelMessage {
    const { settings } = channel;

    return {
      id: channel._id.toHexString(),
      created_at: channel.createdAt.toISOString(),
      updated_at: channel.updatedAt.toISOString(),
      account: channel.account.toHexString(),
      title: channel.title,
      url: channel.url,
      token: channel.token,
      is_enabled: channel.isEnabled,
      agents: channel.agents.map((agent) => agent.toHexString()),
      channel_settings: {
        Main: {
          logo: settings.main.logo,
          see_while_typing: settings.main.seeWhileTyping,
          send_voice: settings.main.sendVoice,
          show_raychat_credit: settings.main.showRaychatCredit,
          InfoForm: {
            is_enabled: settings.main.infoForm.isEnabled,
            is_optional: settings.main.infoForm.isOptional,
            type: settings.main.infoForm.type,
          },
        },

        WidgetLandings: settings.widgetLandings.map((landing) => {
          return {
            laguage: landing.laguage,
            title: landing.title,
            description: landing.description,
            start_message: landing.startMessage,
            start_reply: landing.startReply,
          };
        }),

        WidgetCustomization: {
          logo: settings.widgetCustomization.logo,
          bg_color: settings.widgetCustomization.bgColor,
          lo_bg_color: settings.widgetCustomization.loBgColor,
          secondary_color: settings.widgetCustomization.secondaryColor,
          bg_theme: settings.widgetCustomization.bgTheme,
        },

        WidgetDisplay: {
          show_in_pages_enabled: settings.widgetDisplay.showInPagesEnabled,
          show_pages: settings.widgetDisplay.showPages,
          hide_in_pages_enabled: settings.widgetDisplay.hideInPagesEnabled,
          hide_in_pages: settings.widgetDisplay.hideInPages,
        },

        WidgetPosition: {
          ltr_position: settings.widgetPosition.ltrPosition,
          ltr_bottom: settings.widgetPosition.ltrBottom,
          ltr_right: settings.widgetPosition.ltrRight,
          ltr_show_in_mobile: settings.widgetPosition.ltrShowInMobile,
          rtl_position: settings.widgetPosition.rtlPosition,
          rtl_bottom: settings.widgetPosition.rtlBottom,
          rtl_left: settings.widgetPosition.rtlLeft,
          rtl_show_in_mobile: settings.widgetPosition.rtlShowInMobile,
        },
      },
    };
  }
}
