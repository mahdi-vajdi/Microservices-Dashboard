import { AggregateRoot } from '@nestjs/cqrs';
import { AgentRole } from '../value-objects/agent-roles.enum';

export class Agent extends AggregateRoot {
  constructor(
    private readonly _id: string,
    private readonly _createdAt: Date,
    private _updatedAt: Date,
    private readonly _account: string,
    private readonly _email: string,
    private readonly _phone: string,
    private readonly _firstName: string,
    private readonly _lastName: string,
    private readonly _title: string,
    private readonly _password: string,
    private _refreshToken: string | null,
    private readonly _role: AgentRole,
    private readonly _avatar: string,
    private readonly _online: boolean,
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

  get email() {
    return this._email;
  }

  get phone() {
    return this._phone;
  }

  get title() {
    return this._title;
  }

  get firstName() {
    return this._firstName;
  }

  get lastName() {
    return this._lastName;
  }

  get password() {
    return this._password;
  }

  get avatar() {
    return this._avatar;
  }

  get admin() {
    return this._account;
  }

  get role() {
    return this._role;
  }

  get online() {
    return this._online;
  }

  get refreshToken() {
    return this._refreshToken;
  }

  // entity state operations
  changeRefreshToken(refreshToken: string | null) {
    if (this.refreshToken === undefined) refreshToken = null;

    this._refreshToken = refreshToken;
    this._updatedAt = new Date();
  }

  // Static fatory method
  static create(
    id: string,
    account: string,
    email: string,
    phone: string,
    firstName: string,
    lastName: string,
    title: string,
    password: string,
    refreshToken: string | null,
    role: AgentRole,
    avatar: string,
  ): Agent {
    return new Agent(
      id,
      new Date(),
      new Date(),
      account,
      email,
      phone,
      firstName,
      lastName,
      title,
      password,
      refreshToken,
      role,
      avatar,
      false,
    );

    // TODO: you can publish an event here
  }
}
