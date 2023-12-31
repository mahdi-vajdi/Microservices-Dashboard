import { Controller } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { AgentModel } from '../Infrastructure/models/agent.model';
import { GetAccountAgentsQuery } from '../Application/queries/impl/get-account-agents.query';
import {
  AgentExistsRequest,
  AgentExistsResponse,
  AgentsIdsResponse,
  AgentMessage,
  AgentResponse,
  AgentsResponse,
  GetAccountAgentsRequest,
  GetAgentByEmailReqeust,
  GetAgentByIdRequest,
  GetAgnetsIdsRequest,
  AgentRole,
} from '@app/common';
import { GrpcMethod } from '@nestjs/microservices';
import { Metadata, ServerUnaryCall } from '@grpc/grpc-js';
import { GetAccountAgentsIdsQuery } from '../Application/queries/impl/get-account-agents-ids.query';
import { GetByIdQuery } from '../Application/queries/impl/get-by-id.query';
import { AgentExistsQuery } from '../Application/queries/impl/agent-exists-query';
import { GetByEmailQuery } from '../Application/queries/impl/get-by-email.query';

@Controller()
export class AgentHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @GrpcMethod('AgentService', 'GetAccountAgents')
  async getAccountAgents(
    data: GetAccountAgentsRequest,
    metadata: Metadata,
    call: ServerUnaryCall<any, any>,
  ): Promise<AgentsResponse> {
    const agents = await this.queryBus.execute<
      GetAccountAgentsQuery,
      AgentModel[]
    >(new GetAccountAgentsQuery(data.accountId));

    if (agents && agents.length > 0) {
      return {
        agents: agents.map((agent) => this.toGrpcModel(agent)),
      };
    } else return { agents: undefined };
  }

  @GrpcMethod('AgentService', 'GetAgentsIds')
  async getAgnetsIds(
    data: GetAgnetsIdsRequest,
    metadata: Metadata,
    call: ServerUnaryCall<any, any>,
  ): Promise<AgentsIdsResponse> {
    const agentsIds = await this.queryBus.execute<
      GetAccountAgentsIdsQuery,
      string[]
    >(new GetAccountAgentsIdsQuery(data.accountId));

    if (agentsIds && agentsIds.length > 0) {
      return {
        agentsIds,
      };
    } else return { agentsIds: undefined };
  }

  @GrpcMethod('AgentService', 'GetAgentById')
  async getById(
    data: GetAgentByIdRequest,
    metadata: Metadata,
    call: ServerUnaryCall<any, any>,
  ): Promise<AgentResponse> {
    const agent = await this.queryBus.execute<GetByIdQuery, AgentModel>(
      new GetByIdQuery(data.agentId),
    );

    if (agent) {
      return {
        agent: this.toGrpcModel(agent),
      };
    } else return { agent: undefined };
  }

  @GrpcMethod('AgentService', 'GetAgentByEmail')
  async getByEmail(
    data: GetAgentByEmailReqeust,
    metadata: Metadata,
    call: ServerUnaryCall<any, any>,
  ): Promise<AgentResponse> {
    const agent = await this.queryBus.execute<
      GetByEmailQuery,
      AgentModel | null
    >(new GetByEmailQuery(data.agentEmail));

    if (agent) {
      return {
        agent: this.toGrpcModel(agent),
      };
    } else return { agent: undefined };
  }

  @GrpcMethod('AgentService', 'AgentExists')
  async agentExists(
    { email, phone }: AgentExistsRequest,
    metadata: Metadata,
    call: ServerUnaryCall<any, any>,
  ): Promise<AgentExistsResponse> {
    const agentExists = await this.queryBus.execute<AgentExistsQuery, boolean>(
      new AgentExistsQuery(email, phone),
    );

    if (agentExists) {
      return {
        agentExists,
      };
    } else return { agentExists: undefined };
  }

  private toGrpcModel(agent: AgentModel): AgentMessage {
    return {
      id: agent._id.toHexString(),
      createdAt: agent.createdAt.toISOString(),
      updatedAt: agent.updatedAt.toISOString(),
      account: agent.account.toHexString(),
      email: agent.email,
      phone: agent.phone,
      firstName: agent.firstName,
      lastName: agent.lastName,
      title: agent.title,
      role: AgentRole[agent.role],
      password: agent.password,
      refreshToken: agent.refreshToken,
    };
  }
}
