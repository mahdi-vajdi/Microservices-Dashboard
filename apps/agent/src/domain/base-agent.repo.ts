import { Agent } from './models/agent';

export abstract class AgentRepository {
  abstract add(entity: Agent): Promise<void>;
  abstract save(entity: Agent): Promise<void>;
  abstract findById(id: string): Promise<Agent>;
}
