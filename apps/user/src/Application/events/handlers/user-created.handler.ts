import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UserCreatedEvent } from '../../../Domain/events/user-created.event';

@EventsHandler(UserCreatedEvent)
export class UserCreatedHandler implements IEventHandler<UserCreatedEvent> {
  async handle({ userId }: UserCreatedEvent): Promise<void> {
    console.log('user created; id:' + userId);
  }
}
