import { AgentRole } from './agent-role.enum';

export type JwtPayloadDto = {
  sub: string;
  email: string;
  account: string;
  role: AgentRole;
};
