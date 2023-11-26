import { Module } from '@nestjs/common';
import { AgentController } from './agent.controller';
import { AgentService } from './agent.service';

@Module({
  imports: [],
  controllers: [AgentController],
  providers: [AgentService],
})
export class AgentModule {}
