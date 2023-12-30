import { CreateAgentDto } from '../../dto/create-agent.dto';

export class CreateAgentCommand {
  constructor(public readonly dto: CreateAgentDto) {}
}
