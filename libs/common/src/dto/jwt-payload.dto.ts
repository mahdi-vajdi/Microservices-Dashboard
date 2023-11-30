import { AgentRole } from './agent-roles.enum';

export type JwtPayload = {
  sub: string;
  email: string;
  account: string;
  role: AgentRole;
};
