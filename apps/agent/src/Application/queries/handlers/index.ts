import { GetUserAgentsHandler } from './get-by-admin.handler';
import { GetUserAgentsIdsHandler } from './get-user-agents-ids.handler';

export const AgentQueryHandlers = [
  GetUserAgentsHandler,
  GetUserAgentsIdsHandler,
];
