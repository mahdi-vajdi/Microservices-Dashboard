import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AccountSubjects, AgentDto, ApiResponse } from '@app/common';
import { AccountService } from '../Application/services/account.service';
import { CreateAccountDto } from '../Application/dto/create-account.dto';

@Controller()
export class AccountNatsController {
  constructor(private readonly accountService: AccountService) {}

  @MessagePattern({ cmd: AccountSubjects.CREATE_ACCOUNT })
  async createAccount(
    @Payload() dto: CreateAccountDto,
  ): Promise<ApiResponse<AgentDto | null>> {
    return await this.accountService.createAccount(dto);
  }
}
