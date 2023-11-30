import { AgentRole } from './agent-roles.enum';

export type AgentDto = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  account: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  title: string;
  role: AgentRole;
  password: string;
  refreshToken: string | null;
};
