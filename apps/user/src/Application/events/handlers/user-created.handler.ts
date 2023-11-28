import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UserCreatedEvent } from '../../../Domain/events/user-created.event';
import { Inject } from '@nestjs/common';
import { AGENT_SERVICE } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';

@EventsHandler(UserCreatedEvent)
export class UserCreatedHandler implements IEventHandler<UserCreatedEvent> {
  constructor(
    @Inject(AGENT_SERVICE) private readonly agentService: ClientProxy,
  ) {}

  async handle(event: UserCreatedEvent): Promise<void> {
    // create a default agent when a new user created
    this.agentService.emit<void>('createAgent', {
      email: event.email,
      phone: event.phone,
      title: 'Main Operator',
      name: event.name,
      password: event.password,
      channelIds: [],
      role: 'admin',
    });
  }
}
