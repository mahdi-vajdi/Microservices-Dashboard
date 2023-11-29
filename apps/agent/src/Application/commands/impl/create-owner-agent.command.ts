import { CreateOwnerAgentDto } from '../../dto/create-owner-agent.dto';

export class CreateOwnerAgentCommand {
  constructor(public readonly dto: CreateOwnerAgentDto) {}
}
