import { AgentRole } from '../value-objects/agent-roles.enum';

export class Agent {
  constructor(
    private readonly _id: string,
    private readonly _createdAt: Date,
    private readonly _updatedAt: Date,
    private readonly _email: string,
    private readonly _phone: string,
    private readonly _title: string,
    private readonly _name: string,
    private readonly _password: string,
    private readonly _avatar: string,
    private readonly _admin: string,
    private readonly _role: AgentRole,
    private readonly _online: boolean,
  ) {}

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

  get name() {
    return this._name;
  }

  get password() {
    return this._password;
  }

  get avatar() {
    return this._avatar;
  }

  get admin() {
    return this._admin;
  }

  get role() {
    return this._role;
  }

  get online() {
    return this._online;
  }
}
