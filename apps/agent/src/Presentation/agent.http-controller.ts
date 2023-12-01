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
  JwtPayload,
  Roles,
} from '@app/common';
import { Request } from 'express';

@Controller('agent')
export class AgentHttpController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @UseGuards(CommonAccessTokenGuard)
  @Roles(AgentRole.OWNER)
  @Post()
  async createAgent(
    @Req() req: Request,
    @Body() dto: CreateAgentDto,
  ): Promise<void> {
    const agent = req['user'] as JwtPayload;
    const createdAgent = await this.commandBus.execute<
      CreateAgentCommand,
      void
    >(new CreateAgentCommand(agent.account, dto));

    console.debug('agent createor account: ', agent.account);

    // null value means agent info was duplicate
    if (createdAgent === null)
      throw new BadRequestException('Agent email and phone are duplicate');

    // just return means operation was successfull
    return;
  }

  @UseGuards(CommonAccessTokenGuard)
  @Roles(AgentRole.OWNER, AgentRole.ADMIN)
  @Get()
  async getAccountAgents(@Req() req: Request): Promise<AgentModel[]> {
    const agent = req['user'] as JwtPayload;
    return await this.queryBus.execute<GetAccountAgentsQuery, AgentModel[]>(
      new GetAccountAgentsQuery(agent.account),
    );
  }
}
