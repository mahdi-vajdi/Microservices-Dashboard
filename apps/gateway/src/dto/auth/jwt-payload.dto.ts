import { AgentRole } from '@app/common';

export type JwtPayloadDto = {
  sub: string;
  email: string;
  account: string;
  role: AgentRole;
};
