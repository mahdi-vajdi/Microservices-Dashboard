import { CreateAccountHandler } from './create-account.handler';
import { UpdateRefreshTokenHandler } from './update-refresh-token.handler';

export const AccountCommandHandlers = [
  CreateAccountHandler,
  UpdateRefreshTokenHandler,
];
