import { AggregateRoot } from '@nestjs/cqrs';
import { UserCreatedEvent } from '../events/user-created.event';

export class User extends AggregateRoot {
  constructor(
    private readonly _id: string,
    private readonly _createdAt: Date,
    private _updatedAt: Date,
    private _firstName: string,
    private _lastName: string,
    private _email: string,
    private _phone: string,
    private _password: string,
    private _refreshToken: string | null,
  ) {
    super();
  }

  // Getter methods

  get id() {
    return this._id;
  }

  get firstName() {
    return this._firstName;
  }

  get lastName() {
    return this._lastName;
  }

  get email() {
    return this._email;
  }

  get phone() {
    return this._phone;
  }

  get password() {
    return this._password;
  }

  get refreshToken() {
    return this._refreshToken;
  }

  get createdAt() {
    return this._createdAt;
  }

  get updatedAt() {
    return this._updatedAt;
  }

  // entity state operation

  changeUserInfo(firstName?: string, lastName?: string, phone?: string): void {
    if (firstName !== undefined) this._firstName = firstName.trim();
    if (lastName !== undefined) this._lastName = lastName.trim();
    if (phone !== undefined) this._phone = phone.trim();

    this._updatedAt = new Date();
  }

  changeRefreshToken(token: string | null): void {
    // turn undefined arguments to null
    token === undefined ? null : token;

    this._refreshToken = token;
    this._updatedAt = new Date();
  }

  // Static factory method
  static create(
    id: string,
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    password: string,
    passwordHash: string,
    refreshToken: string,
  ): User {
    const user = new User(
      id,
      new Date(),
      new Date(),
      firstName,
      lastName,
      email,
      phone,
      passwordHash,
      refreshToken,
    );

    user.apply(
      new UserCreatedEvent(
        id,
        email,
        phone,
        `${firstName} ${lastName}`,
        password,
      ),
    );

    return user;
  }
}
