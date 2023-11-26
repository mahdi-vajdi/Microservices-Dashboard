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

  // Domain model operations

  changeFirstName(firstName: string): void {
    this.validateName(firstName);
    this._firstName = firstName.trim();
    this._updatedAt = new Date();
  }

  changeLastName(lastName: string): void {
    this.validateName(lastName);
    this._lastName = lastName.trim();
    this._updatedAt = new Date();
  }

  changeEmail(email: string) {
    this._email = email;
    this._updatedAt = new Date();
  }

  changePhone(phone: string) {
    this._phone = phone;
    this._updatedAt = new Date();
  }

  chnagePassword(password: string) {
    this._password = password;
    this._updatedAt = new Date();
  }

  changeRefreshToken(token: string | null) {
    // turn undefined arguments to null
    token === undefined ? null : token;
    this._refreshToken = token;
    this._updatedAt = new Date();
  }

  // Helper methods

  private validateName(_name: string): void | Error {
    const name = _name.trim();
    if (name.length === 0) throw new Error('First name cannot be empty');
    else if (name.length < 3)
      throw new Error('First name connot be less than three characters');
    else if (name.length > 15)
      throw new Error('First name cannot be longer than 15 characters');
    else return;
  }

  // Static factory method
  static create(
    id: string,
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    password: string,
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
      password,
      refreshToken,
    );

    user.apply(new UserCreatedEvent(user.id));
    return user;
  }
}
