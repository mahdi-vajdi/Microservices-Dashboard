import { Body, Controller, Inject, Post, Req, UseGuards } from '@nestjs/common';
import {
  AGENT_SERVICE,
  AgentRole,
  CommonAccessTokenGuard,
  JwtPayloadDto,
  Roles,
} from '@app/common';
import { Request } from 'express';
import { CreateAgentDto } from '../dto/agent/create-agent.dto';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Controller('agent')
export class AgentHttpController {
  constructor(
    @Inject(AGENT_SERVICE) private readonly commandService: ClientProxy,
  ) {}

  @UseGuards(CommonAccessTokenGuard)
  @Roles(AgentRole.OWNER)
  @Post()
  async createAgent(
    @Req() req: Request,
    @Body() dto: CreateAgentDto,
  ): Promise<void> {
    const jwtPaylaod = req['user'] as JwtPayloadDto;
    await lastValueFrom(
      this.commandService.emit('createAgent', {
        requesterAccountId: jwtPaylaod.account,
        ...dto,
      }),
    );
  }

  // @UseGuards(CommonAccessTokenGuard)
  // @Roles(AgentRole.OWNER, AgentRole.ADMIN)
  // @Get()
  // async getAccountAgents(@Req() req: Request): Promise<AgentModel[]> {
  //   const agent = req['user'] as JwtPayloadDto;
  //   return await this.queryBus.execute<GetAccountAgentsQuery, AgentModel[]>(
  //     new GetAccountAgentsQuery(agent.account),
  //   );
  // }
}
