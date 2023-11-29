import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateRefreshTokenCommand } from '../impl/update-refresh-token.command';
import { AgentEntityRepository } from 'apps/agent/src/Domain/base-agent.entity-repo';

@CommandHandler(UpdateRefreshTokenCommand)
export class UpdateRefreshTokenHandler
  implements ICommandHandler<UpdateRefreshTokenCommand, void>
{
  constructor(private readonly agnetRepo: AgentEntityRepository) {}

  async execute(command: UpdateRefreshTokenCommand): Promise<void> {
    const agent = await this.agnetRepo.findById(command.agentId);
    if (!agent) return;

    // const hashedToken =
    //   command.token !== null ? await bcrypt.hash(command.token, 10) : null;

    agent.changeRefreshToken(command.refreshToken);
    await this.agnetRepo.save(agent);
    agent.commit();
  }
}
