import {
  Body,
  Controller,
  Get,
  Inject,
  OnModuleInit,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  AgentRole,
  AgentServiceClient,
  AgentsResponse,
  GRPC_AGENT,
  JwtPayloadDto,
  Roles,
  AgentSubjects,
} from '@app/common';
import { Request } from 'express';
import { CreateAgentDto } from '../dto/agent/create-agent.dto';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { AccessTokenGuard } from '../guards/access-token.guard';
import { NatsJetStreamClientProxy } from '@nestjs-plugins/nestjs-nats-jetstream-transport';

@Controller('agent')
export class AgentHttpController implements OnModuleInit {
  private agentQueryService: AgentServiceClient;

  constructor(
    private readonly natsClient: NatsJetStreamClientProxy,
    @Inject(GRPC_AGENT) private readonly agentGrpcClient: ClientGrpc,
  ) {}

  onModuleInit() {
    this.agentQueryService =
      this.agentGrpcClient.getService<AgentServiceClient>('AgentService');
  }

  @UseGuards(AccessTokenGuard)
  @Roles(AgentRole.OWNER)
  @Post()
  createAgent(
    @Req() req: Request,
    @Body() dto: CreateAgentDto,
  ): Observable<null> {
    const jwtPaylaod = req['user'] as JwtPayloadDto;
    return this.natsClient.send<null>(
      { cmd: AgentSubjects.CREATE_AGENT },
      {
        requesterAccountId: jwtPaylaod.account,
        ...dto,
      },
    );
  }

  @UseGuards(AccessTokenGuard)
  @Roles(AgentRole.OWNER, AgentRole.ADMIN)
  @Get()
  getAccountAgents(@Req() req: Request): Observable<AgentsResponse> {
    const jwtPaylaod = req['user'] as JwtPayloadDto;
    return this.agentQueryService.getAccountAgents({
      accountId: jwtPaylaod.account,
    });
  }
}
