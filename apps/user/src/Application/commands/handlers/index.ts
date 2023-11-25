import { CreateUserHandler } from './create-user.handler';
import { UpdateRefreshTokenHandler } from './update-refresh-token.handler';

export const UserCommandHandlers = [
  CreateUserHandler,
  UpdateRefreshTokenHandler,
];
