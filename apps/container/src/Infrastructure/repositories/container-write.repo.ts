import { Types } from 'mongoose';
import { Container } from '../../Domain/models/container';
import { ContainerRepository } from '../../Domain/base-container.repo';
import { ContainerModel } from '../models/container.model';

export class ContainerWriteRepository extends ContainerRepository {
  add(entity: Container): Promise<void> {
    throw new Error('Method not implemented.');
  }

  findById(id: string): Promise<Container> {
    throw new Error('Method not implemented.');
  }

  private fromEntity(container: Container): ContainerModel {
    return {
      _id: new Types.ObjectId(container.id),
      createdAt: container.createdAt,
      updatedAt: container.updatedAt,
      owner: new Types.ObjectId(container.owner),
      title: container.title,
      url: container.url,
      token: container.token,
      isEnabled: container.isEnabled,
      agents: container.agents.map((agent) => new Types.ObjectId(agent)),
      settings: container.settings,
    };
  }

  private toEntity(model: ContainerModel): Container {
    return new Container(
      model._id.toHexString(),
      model.createdAt,
      model.updatedAt,
      model.owner.toHexString(),
      model.title,
      model.url,
      model.token,
      model.isEnabled,
      model.agents.map((agent) => agent.toHexString()),
      model.settings,
    );
  }
}
