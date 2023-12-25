import { Observable } from 'rxjs/internal/Observable';
import { GetAccountChannelsRequest } from './get-account-channels-request.dto';
import { GetChannelByIdRequest } from './get-channel-by-id.dto';
import { ChannelsMessageResponse } from './channels-response.dto';
import { ChannelMessageResponse } from './channel-response.dto';

export interface ChannelServiceClient {
  GetAccountChannels(
    request: GetAccountChannelsRequest,
  ): Observable<ChannelsMessageResponse>;
  GetChannelById(
    request: GetChannelByIdRequest,
  ): Observable<ChannelMessageResponse>;
}
