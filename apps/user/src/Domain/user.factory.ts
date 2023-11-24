import { Injectable } from '@nestjs/common';
import { User } from './user.domain';
import { UserCreatedEvent } from '../Application/events/impl/user-created.event';

@Injectable()
export class UserFactory {
  public create(
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
