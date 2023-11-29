import { AggregateRoot } from '@nestjs/cqrs';

export class Account extends AggregateRoot {
  constructor(
    private readonly _id: string,
    private readonly _createdAt: Date,
    private _updatedAt: Date,
    private readonly _owner: string,
  ) {
    super();
  }

  // Getter methods

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

  // entity state operations

  // Static factory method
  static create(id: string, owner: string): Account {
    const user = new Account(id, new Date(), new Date(), owner);
    // user.apply(new UserCreatedEvent(id, owner));
    return user;
  }
}
