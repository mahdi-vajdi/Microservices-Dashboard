import { GetByEmailHandler } from './get-by-email.handler';
import { GetByIdHandler } from './get-by-id.handler';

export const AccountQueryHandlers = [GetByIdHandler, GetByEmailHandler];
