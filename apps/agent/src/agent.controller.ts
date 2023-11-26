import { Controller, Get } from '@nestjs/common';
import { AgentService } from './agent.service';

@Controller()
export class AgentController {
  constructor(private readonly agentService: AgentService) {}

  @Get()
  getHello(): string {
    return this.agentService.getHello();
  }
}
