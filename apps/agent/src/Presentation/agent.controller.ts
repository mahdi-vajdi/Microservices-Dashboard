import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateAgentCommand } from '../Application/commands/impl/create-agent.command';
import { CreateAgentDto } from '../Application/dto/create-agent.dto';
import { AgentModel } from '../Infrastructure/models/agent.model';
import { GetUserAgents } from '../Application/queries/impl/get-user-agents.query';
import { CommonAccessTokenGuard, JwtPayload } from '@app/common';
import { Request } from 'express';

@Controller('agent')
export class AgentController {
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
    const user = req['user'] as JwtPayload;
    await this.commandBus.execute<CreateAgentCommand, void>(
      new CreateAgentCommand(user.sub, dto),
    );
  }

  @UseGuards(CommonAccessTokenGuard)
  @Get()
  async getUserAgents(@Req() req: Request): Promise<AgentModel[]> {
    const user = req['user'] as JwtPayload;
    return await this.queryBus.execute<GetUserAgents, AgentModel[]>(
      new GetUserAgents(user.sub),
    );
  }
}
