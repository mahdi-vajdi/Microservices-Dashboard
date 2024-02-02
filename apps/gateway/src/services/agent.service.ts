import { AgentServiceClient, AgentSubjects, GRPC_AGENT } from '@app/common';
import { NatsJetStreamClientProxy } from '@nestjs-plugins/nestjs-nats-jetstream-transport';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { JwtPayloadDto } from '../dto/auth/jwt-payload.dto';
import { CreateAgentDto } from '../dto/agent/create-agent.dto';

@Injectable()
export class AgentService implements OnModuleInit {
  private agentQueryService: AgentServiceClient;

  constructor(
    private readonly natsClient: NatsJetStreamClientProxy,
    @Inject(GRPC_AGENT) private readonly agentGrpcClient: ClientGrpc,
  ) {}

  onModuleInit() {
    this.agentQueryService =
      this.agentGrpcClient.getService<AgentServiceClient>('AgentService');
  }

  createAgent(user: JwtPayloadDto, dto: CreateAgentDto) {
    return this.natsClient.send<null>(
      { cmd: AgentSubjects.CREATE_AGENT },
      {
        requesterAccountId: user.account,
        ...dto,
      },
    );
  }

  getAccountAgents(user: JwtPayloadDto) {
    return this.agentQueryService.getAccountAgents({
      accountId: user.account,
    });
  }
}
