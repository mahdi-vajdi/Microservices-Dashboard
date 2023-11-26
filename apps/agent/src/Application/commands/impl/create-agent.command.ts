import { CreateAgentDto } from '../../dto/create-agent.dto';

export class CreateAgentCommand {
  constructor(
    public readonly userId: string,
    public readonly dto: CreateAgentDto,
  ) {}
}
