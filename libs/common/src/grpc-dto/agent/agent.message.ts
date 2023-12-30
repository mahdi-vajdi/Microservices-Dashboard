export interface AgentMessage {
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
}

export enum AgentRole {
  OWNER = 0,
  AGENT = 1,
  ADMIN = 2,
}
