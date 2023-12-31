import { Observable } from 'rxjs';
import { AgentsResponse } from './agents.response';
import { AgentsIdsResponse } from './agent-ids.response';
import { AgentResponse } from './agent.response';
import { AgentExistsResponse } from './agent-exists.reponse';
import { GetAccountAgentsRequest } from './get-account-agents.request';
import { GetAgnetsIdsRequest } from './get-agents-ids.request';
import { GetAgentByIdRequest } from './get-agent-by-id.request';
import { GetAgentByEmailReqeust } from './get-agent-by-email.request';
import { AgentExistsRequest } from './agents.exists-request.request';

export interface AgentServiceClient {
  getAccountAgents(
    request: GetAccountAgentsRequest,
  ): Observable<AgentsResponse>;
  getAgentsIds(request: GetAgnetsIdsRequest): Observable<AgentsIdsResponse>;
  getAgentById(request: GetAgentByIdRequest): Observable<AgentResponse>;
  getAgentByEmail(request: GetAgentByEmailReqeust): Observable<AgentResponse>;
  agentExists(request: AgentExistsRequest): Observable<AgentExistsResponse>;
}
