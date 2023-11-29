import { CreateAgentHandler } from './create-agent.handler';
import { CreateOwnerAgentHandler } from './create-owner-agent.handler';
import { UpdateRefreshTokenHandler } from './update-refresh-token.handler';

export const AgentCommandHandlers = [
  CreateAgentHandler,
  CreateOwnerAgentHandler,
  UpdateRefreshTokenHandler,
];
