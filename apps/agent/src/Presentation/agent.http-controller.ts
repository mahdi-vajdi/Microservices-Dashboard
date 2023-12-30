import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateAgentCommand } from '../Application/commands/impl/create-agent.command';
import { CreateAgentDto } from '../Application/dto/create-agent.dto';
import { AgentModel } from '../Infrastructure/models/agent.model';
import { GetAccountAgentsQuery } from '../Application/queries/impl/get-account-agents.query';
import {
  AgentRole,
  CommonAccessTokenGuard,
  JwtPayloadDto,
  Roles,
} from '@app/common';
import { Request } from 'express';

@Controller('agent')
export class AgentHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @UseGuards(CommonAccessTokenGuard)
  @Roles(AgentRole.OWNER, AgentRole.ADMIN)
  @Get()
  async getAccountAgents(@Req() req: Request): Promise<AgentModel[]> {
    const agent = req['user'] as JwtPayloadDto;
    return await this.queryBus.execute<GetAccountAgentsQuery, AgentModel[]>(
      new GetAccountAgentsQuery(agent.account),
    );
  }
}
