import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UserCreatedEvent } from '../impl/user-created.event';

@EventsHandler(UserCreatedEvent)
export class UserCreatedHandler implements IEventHandler<UserCreatedEvent> {
  async handle({ userId }: UserCreatedEvent): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
