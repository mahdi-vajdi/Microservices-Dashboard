import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateContainerCommand } from '../impl/create-container.command';
import { ContainerRepository } from 'apps/container/src/Domain/base-container.repo';
import { Inject } from '@nestjs/common';
import { AGENT_SERVICE } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs/internal/lastValueFrom';
import { Container } from 'apps/container/src/Domain/models/container';
import { Types } from 'mongoose';

@CommandHandler(CreateContainerCommand)
export class CreateContainerHandler
  implements ICommandHandler<CreateContainerCommand, void>
{
  constructor(
    @Inject(AGENT_SERVICE) private readonly agentService: ClientProxy,
    private readonly containerRepo: ContainerRepository,
  ) {}

  async execute({ id, dto }: CreateContainerCommand): Promise<void> {
    let agents: string[] = [];

    if (dto.addAllAgents === true) {
      agents = await lastValueFrom(
        this.agentService.send<string[]>('getAgentIds', { id }),
      );
    }

    const container = Container.create(
      new Types.ObjectId().toHexString(),
      id,
      dto.title,
      dto.url,
      crypto.randomUUID(),
      agents,
    );

    await this.containerRepo.add(container);
    container.commit();
  }
}
