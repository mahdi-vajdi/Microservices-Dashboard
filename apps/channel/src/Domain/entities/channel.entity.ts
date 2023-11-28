import { AggregateRoot } from '@nestjs/cqrs';
import { ChannelSettings } from '../value-objects/channel-settings';
import { DefaultChannelSettings } from '../value-objects/channel-setting-default';
import { ChannelCreatedEvent } from '../events/channel-created.event';

export class Channel extends AggregateRoot {
  constructor(
    private _id: string,
    private _createdAt: Date,
    private _updatedAt: Date,
    private readonly _owner: string,
    private _title: string,
    private _url: string,
    private readonly _token: string,
    private _isEnabled: boolean,
    private _agents: string[],
    private readonly _settings: ChannelSettings,
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

  updateAgents(agentIds: string[]): void {
    this._agents = agentIds;
    this._updatedAt = new Date();
    return;
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
    const channel = new Channel(
      id,
      new Date(),
      new Date(),
      owner,
      title,
      url,
      token,
      true,
      agents,
      DefaultChannelSettings,
    );

    channel.apply(new ChannelCreatedEvent(channel.id));

    return channel;
  }
}
