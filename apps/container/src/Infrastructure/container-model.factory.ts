import { EntityModelFactory } from '@app/common';
import { ContainerModel } from './models/container.model';
import { Container } from '../Domain/Container';
import { Types } from 'mongoose';

export class ContainerSchemaFactory
  implements EntityModelFactory<Container, ContainerModel>
{
  create(container: Container): ContainerModel {
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
    };
  }

  createFromModel(model: ContainerModel): Container {
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
    );
  }
}
