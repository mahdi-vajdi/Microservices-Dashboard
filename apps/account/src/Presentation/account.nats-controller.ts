import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { AccountSubjects, ApiResponse } from '@app/common';
import { AccountService } from '../Application/services/account.service';
import { CreateAccountDto } from '../Application/dto/create-account.dto';
import { AgentModel } from 'apps/agent/src/Infrastructure/models/agent.model';

@Controller()
export class AccountNatsController {
  constructor(private readonly accountService: AccountService) {}

  @EventPattern(AccountSubjects.CREATE_ACCOUNT)
  async createAccount(
    @Payload() dto: CreateAccountDto,
  ): Promise<ApiResponse<AgentModel | null>> {
    return await this.accountService.createAccount(dto);
  }
}
