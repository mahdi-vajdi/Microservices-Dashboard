import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateAgentCommand } from '../Application/commands/impl/create-agent.command';
import { CreateAgentDto } from '../Application/dto/create-agent.dto';
import { AgentModel } from '../Infrastructure/models/agent.model';
import { GetAccountAgentsQuery } from '../Application/queries/impl/get-account-agents.query';
import { CommonAccessTokenGuard, JwtPayload } from '@app/common';
import { Request } from 'express';

@Controller('agent')
export class AgentHttpController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @UseGuards(CommonAccessTokenGuard)
  @Post()
  async createAgent(
    @Req() req: Request,
    @Body() dto: CreateAgentDto,
  ): Promise<void> {
    const agent = req['user'] as JwtPayload;
    await this.commandBus.execute<CreateAgentCommand, void>(
      new CreateAgentCommand(agent.sub, dto),
    );
  }

  @UseGuards(CommonAccessTokenGuard)
  @Get()
  async getAccountAgents(@Req() req: Request): Promise<AgentModel[]> {
    const agent = req['user'] as JwtPayload;
    return await this.queryBus.execute<GetAccountAgentsQuery, AgentModel[]>(
      new GetAccountAgentsQuery(agent.sub),
    );
  }
}
