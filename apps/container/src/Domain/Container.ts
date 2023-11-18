import { AggregateRoot } from '@nestjs/cqrs';
import { ContainerSettings } from './ContainerSettings';

export class Container extends AggregateRoot {
  constructor(
    private readonly _id: string,
    private readonly _createdAt: Date,
    private readonly _updatedAt: Date,
    private readonly _owner: string,
    private readonly _title: string,
    private readonly _url: string,
    private readonly _token: string,
    private readonly _isEnabled: boolean,
    private readonly _agents: string[],
    private readonly _settings: ContainerSettings,
  ) {
    super();
  }

  public get id() {
    return this._id;
  }

  public get createdAt() {
    return new Date(this._createdAt);
  }

  public get updatedAt() {
    return new Date(this._updatedAt);
  }

  public get owner() {
    return this._owner;
  }

  public get title() {
    return this._title;
  }

  public get url() {
    return this._url;
  }

  public get token() {
    return this._token;
  }

  public get isEnabled() {
    return this._isEnabled;
  }

  public get agents() {
    return [...this._agents];
  }

  public get settings() {
    return { ...this._settings };
  }
}
