import { AgentRole } from '@app/common';

export interface JwtPayloadDto {
  sub: string;
  email: string;
  account: string;
  role: AgentRole;
}
