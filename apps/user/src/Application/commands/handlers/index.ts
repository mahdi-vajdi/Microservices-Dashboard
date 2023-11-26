import { CreateUserHandler } from './CreateUserHandler';
import { UpdateRefreshTokenHandler } from './update-refresh-token.handler';

export const UserCommandHandlers = [
  CreateUserHandler,
  UpdateRefreshTokenHandler,
];
