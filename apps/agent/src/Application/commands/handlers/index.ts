import { CreateAgentHandler } from './create-agent.handler';
import { UpdateRefreshTokenHandler } from './update-refresh-token.handler';

export const AgentCommandHandlers = [
  CreateAgentHandler,
  UpdateRefreshTokenHandler,
];
