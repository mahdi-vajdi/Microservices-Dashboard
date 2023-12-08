import { AgentRole } from './agent-roles.enum';

export type JwtPayloadDto = {
  sub: string;
  email: string;
  account: string;
  role: AgentRole;
};
