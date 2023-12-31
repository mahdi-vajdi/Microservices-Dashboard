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
  AGENT_SERVICE,
  AgentRole,
  AgentServiceClient,
  AgentsResponse,
  CommonAccessTokenGuard,
  JwtPayloadDto,
  Roles,
} from '@app/common';
import { Request } from 'express';
import { CreateAgentDto } from '../dto/agent/create-agent.dto';
import { ClientGrpc, ClientProxy } from '@nestjs/microservices';
import { Observable, defaultIfEmpty } from 'rxjs';

@Controller('agent')
export class AgentHttpController implements OnModuleInit {
  private agentQueryService: AgentServiceClient;

  constructor(
    @Inject(AGENT_SERVICE) private readonly commandService: ClientProxy,
    @Inject('AGENT_PACKAGE') private readonly agentGrpcClient: ClientGrpc,
  ) {}

  onModuleInit() {
    this.agentQueryService =
      this.agentGrpcClient.getService<AgentServiceClient>('AgentService');
  }

  @UseGuards(CommonAccessTokenGuard)
  @Roles(AgentRole.OWNER)
  @Post()
  createAgent(
    @Req() req: Request,
    @Body() dto: CreateAgentDto,
  ): Observable<any> {
    const jwtPaylaod = req['user'] as JwtPayloadDto;
    return this.commandService
      .send('createAgent', {
        requesterAccountId: jwtPaylaod.account,
        ...dto,
      })
      .pipe(defaultIfEmpty('Agent Created'));
  }

  @UseGuards(CommonAccessTokenGuard)
  @Roles(AgentRole.OWNER, AgentRole.ADMIN)
  @Get()
  getAccountAgents(@Req() req: Request): Observable<AgentsResponse> {
    const jwtPaylaod = req['user'] as JwtPayloadDto;
    return this.agentQueryService.getAccountAgents({
      accountId: jwtPaylaod.account,
    });
  }
}
