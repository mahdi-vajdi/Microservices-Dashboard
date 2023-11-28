import { Agent } from './entities/agent.entity';

export abstract class AgentEntityRepository {
  abstract add(entity: Agent): Promise<void>;
  abstract save(entity: Agent): Promise<void>;
  abstract findById(id: string): Promise<Agent>;
}
