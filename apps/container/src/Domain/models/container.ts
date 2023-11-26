import { AggregateRoot } from '@nestjs/cqrs';
import { ContainerSettings } from '../value-objects/container-settings';
import { DefaultContainerSettings } from '../value-objects/container-setting-default';
import { ContainerCreatedEvent } from '../events/container-created.event';

export class Container extends AggregateRoot {
  constructor(
    private _id: string,
    private _createdAt: Date,
    private _updatedAt: Date,
    private readonly _owner: string,
    private _title: string,
    private _url: string,
    private readonly _token: string,
    private _isEnabled: boolean,
    private readonly _agents: string[],
    private readonly _settings: ContainerSettings,
  ) {
    super();
  }

  get id() {
    return this._id;
  }

  get createdAt() {
    return this._createdAt;
  }

  get updatedAt() {
    return this._updatedAt;
  }

  get owner() {
    return this._owner;
  }

  get title() {
    return this._title;
  }

  get url() {
    return this._url;
  }

  get token() {
    return this._token;
  }

  get isEnabled() {
    return this._isEnabled;
  }

  get agents() {
    return this._agents;
  }

  get settings() {
    return this._settings;
  }

  // Factory method
  static create(
    id: string,
    owner: string,
    title: string,
    url: string,
    token: string,
    agents: string[],
  ) {
    const container = new Container(
      id,
      new Date(),
      new Date(),
      owner,
      title,
      url,
      token,
      true,
      agents,
      DefaultContainerSettings,
    );

    container.apply(new ContainerCreatedEvent(container.id));

    return container;
  }
}
