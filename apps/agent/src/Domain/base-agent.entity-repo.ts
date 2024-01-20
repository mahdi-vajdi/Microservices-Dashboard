import { Agent } from './entities/agent.entity';

/**
 * The abstract class for agent command repository
 *
 * @export
 * @abstract
 * @class AgentEntityRepository
 * @typedef {AgentEntityRepository}
 */
export abstract class AgentEntityRepository {
  /**
   *    * Create a new agent model in the database
   *
   * @abstract
   * @param {Agent} entity
   * @returns {Promise<void>}
   */
  abstract add(entity: Agent): Promise<void>;
  /**
   * Update an existing agent model
   *
   *
   * @abstract
   * @param {Agent} entity
   * @returns {Promise<void>}
   */
  abstract save(entity: Agent): Promise<void>;
  /**
   * Find an agent model by its Id
   *
   *
   * @abstract
   * @param {string} id
   * @returns {Promise<Agent>}
   */
  abstract findById(id: string): Promise<Agent>;
}
