import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateAgentCommand } from '../Application/commands/impl/create-agent.command';
import { CreateAgentDto } from '../Application/dto/create-agent.dto';
import { AgentModel } from '../Infrastructure/models/agent.model';
import { GetByAdminQuery } from '../Application/queries/impl/get-by-admin.query';

@Controller('agent')
export class AgentController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  async createAgent(
    @Request() req,
    @Body() dto: CreateAgentDto,
  ): Promise<void> {
    await this.commandBus.execute<CreateAgentCommand, void>(
      new CreateAgentCommand(req.user.sub, dto),
    );
  }

  @Get()
  async getByAdmin(@Request() req): Promise<AgentModel[]> {
    return await this.queryBus.execute<GetByAdminQuery, AgentModel[]>(
      new GetByAdminQuery(req.user.id),
    );
  }
}
