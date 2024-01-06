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
  NATS_AGENT,
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
import { ClientGrpc, ClientProxy } from '@nestjs/microservices';
import { Observable, defaultIfEmpty } from 'rxjs';
import { AccessTokenGuard } from '../guards/access-token.guard';

@Controller('agent')
export class AgentHttpController implements OnModuleInit {
  private agentQueryService: AgentServiceClient;

  constructor(
    @Inject(NATS_AGENT) private readonly commandService: ClientProxy,
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
  ): Observable<any> {
    const jwtPaylaod = req['user'] as JwtPayloadDto;
    return this.commandService
      .send(AgentSubjects.CREATE_AGENT, {
        requesterAccountId: jwtPaylaod.account,
        ...dto,
      })
      .pipe(defaultIfEmpty('Agent Created'));
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
