import { Controller } from '@nestjs/common';
import {
  AgentExistsRequest,
  AgentExistsResponse,
  AgentsIdsResponse,
  AgentResponse,
  AgentsResponse,
  GetAccountAgentsRequest,
  GetAgentByEmailReqeust,
  GetAgentByIdRequest,
  GetAgnetsIdsRequest,
} from '@app/common';
import { GrpcMethod } from '@nestjs/microservices';
import { Metadata, ServerUnaryCall } from '@grpc/grpc-js';
import { AgentService } from '../Application/services/agent.service';

/**
 * The Controller that handles the queries via grpc
 *
 * @export
 * @class AgentHttpController
 * @typedef {AgentHttpController}
 */
@Controller()
export class AgentHttpController {
  constructor(private readonly agentService: AgentService) {}

  @GrpcMethod('AgentService', 'GetAccountAgents')
  async getAccountAgents(
    data: GetAccountAgentsRequest,
    metadata: Metadata,
    call: ServerUnaryCall<any, any>,
  ): Promise<AgentsResponse> {
    return this.agentService.getAccountAgents(data.accountId);
  }

  @GrpcMethod('AgentService', 'GetAgentsIds')
  async getAgentsIds(
    data: GetAgnetsIdsRequest,
    metadata: Metadata,
    call: ServerUnaryCall<any, any>,
  ): Promise<AgentsIdsResponse> {
    return this.agentService.getAgentsIds(data.accountId);
  }

  @GrpcMethod('AgentService', 'GetAgentById')
  async getById(
    data: GetAgentByIdRequest,
    metadata: Metadata,
    call: ServerUnaryCall<any, any>,
  ): Promise<AgentResponse> {
    return this.agentService.getById(data.agentId);
  }

  @GrpcMethod('AgentService', 'GetAgentByEmail')
  async getByEmail(
    data: GetAgentByEmailReqeust,
    metadata: Metadata,
    call: ServerUnaryCall<any, any>,
  ): Promise<AgentResponse> {
    return this.agentService.getByEmail(data.agentEmail);
  }

  @GrpcMethod('AgentService', 'AgentExists')
  async agentExists(
    data: AgentExistsRequest,
    metadata: Metadata,
    call: ServerUnaryCall<any, any>,
  ): Promise<AgentExistsResponse> {
    return this.agentService.agentExists(data.email, data.phone);
  }
}
