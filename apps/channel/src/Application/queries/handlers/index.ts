import { GetByIdHandler } from './get-by-id.handler';
import { GetUserChannelsHandler } from './get-by-user.handle';

export const ChannelQueryHandlers = [GetUserChannelsHandler, GetByIdHandler];
