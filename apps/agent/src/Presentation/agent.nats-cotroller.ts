import { Controller } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { GetAgentIdsDto } from '../Application/dto/get-agents-ids.dto';
import { GetAccountAgentsIdsQuery } from '../Application/queries/impl/get-account-agents-ids.query';
import { UpdateRefreshTokenDto } from '../Application/dto/update-refresh-token.dto';
import { UpdateRefreshTokenCommand } from '../Application/commands/impl/update-refresh-token.command';
import { AgentExistsDto } from '../Application/dto/agent-exists.dto';
import { AgentExistsQuery } from '../Application/queries/impl/agent-exists-query';
import { GetByIdDto } from '../Application/dto/get-by-id.dto';
import { AgentDto } from '@app/common';
import { GetByIdQuery } from '../Application/queries/impl/get-by-id.query';
import { GetByEmailDto } from '../Application/dto/get-by-email.dto';
import { GetByEmailQuery } from '../Application/queries/impl/get-by-email.query';
import { CreateOwnerAgentDto } from '../Application/dto/create-owner-agent.dto';
import { CreateOwnerAgentCommand } from '../Application/commands/impl/create-owner-agent.command';

@Controller()
export class AgentNatsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @MessagePattern('createOwnerAgent')
  async createOwnerAgent(@Payload() dto: CreateOwnerAgentDto): Promise<void> {
    await this.commandBus.execute<CreateOwnerAgentCommand, AgentDto>(
      new CreateOwnerAgentCommand(dto),
    );
  }

  @MessagePattern('getAgentsIds')
  async getAgnetsIds(
    @Payload() { accountId }: GetAgentIdsDto,
  ): Promise<string[]> {
    return await this.queryBus.execute<GetAccountAgentsIdsQuery, string[]>(
      new GetAccountAgentsIdsQuery(accountId),
    );
  }

  @MessagePattern('getAgentById')
  async getById(@Payload() { agentId }: GetByIdDto): Promise<AgentDto> {
    return this.queryBus.execute<GetByIdQuery, AgentDto>(
      new GetByIdQuery(agentId),
    );
  }

  @MessagePattern('getAgentByEmail')
  async getByEmail(
    @Payload() { email }: GetByEmailDto,
  ): Promise<AgentDto | null> {
    return this.queryBus.execute<GetByEmailQuery, AgentDto | null>(
      new GetByEmailQuery(email),
    );
  }

  @EventPattern('updateRefreshToken')
  async updateRefreshToken(
    @Payload() { agentId: id, newToken: token }: UpdateRefreshTokenDto,
  ): Promise<void> {
    await this.commandBus.execute<UpdateRefreshTokenCommand, void>(
      new UpdateRefreshTokenCommand(id, token),
    );
  }

  @MessagePattern('agentExists')
  async agentExists(
    @Payload() { email, phone }: AgentExistsDto,
  ): Promise<boolean> {
    return await this.queryBus.execute<AgentExistsQuery, boolean>(
      new AgentExistsQuery(email, phone),
    );
  }
}
