import { GetByEmailHandler } from './get-by-email.handler';
import { GetByIdHandler } from './get-by-id.handler';
import { UserExistsHandler } from './user-exists.handler';

export const UserQueryHandlers = [
  GetByIdHandler,
  GetByEmailHandler,
  UserExistsHandler,
];
