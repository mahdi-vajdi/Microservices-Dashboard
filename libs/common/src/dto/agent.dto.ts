import { AgentRole } from './agent-role.enum';

export type AgentDto = {
  id: string;
  createdAt: string;
  updatedAt: string;
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
