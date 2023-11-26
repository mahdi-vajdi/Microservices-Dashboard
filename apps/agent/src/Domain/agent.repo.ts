import { Agent } from './entities/agent';

export interface AgentRepository {
  add(entity: Agent): Promise<void>;
  save(entity: Agent): Promise<void>;
  findById(id: string): Promise<Agent>;
}
