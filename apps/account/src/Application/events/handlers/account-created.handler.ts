import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { AccountCreatedEvent } from '../../../Domain/events/account-created.event';
import { Logger } from '@nestjs/common';
import { NatsJetStreamClientProxy } from '@nestjs-plugins/nestjs-nats-jetstream-transport';

@EventsHandler(AccountCreatedEvent)
export class AccountCreatedHandler
  implements IEventHandler<AccountCreatedEvent>
{
  private readonly logger = new Logger(AccountCreatedHandler.name);

  constructor(private readonly natsClient: NatsJetStreamClientProxy) {}

  async handle(event: AccountCreatedEvent): Promise<void> {
    // create a default agent when a new account created
    this.logger.log('Account created: ', event);
  }
}
