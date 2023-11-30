import { AgentExistsHandler } from './agent-exists.handler';
import { GetAccountAgentsHandler } from './get-account-agents.handler';
import { GetByEmailHandler } from './get-by-email.handler';
import { GetByIdHandler } from './get-by-id.handler';
import { GetUserAgentsIdsHandler } from './get-account-agents-ids.handler';

export const AgentQueryHandlers = [
  AgentExistsHandler,
  GetAccountAgentsHandler,
  GetByEmailHandler,
  GetByIdHandler,
  GetUserAgentsIdsHandler,
];
