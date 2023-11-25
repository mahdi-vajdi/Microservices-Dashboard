import { GetByIdHandler } from './find-by-id.handler';
import { GetByEmailHandler } from './get-by-email.handler';

export const UserQueryHandlers = [GetByIdHandler, GetByEmailHandler];
