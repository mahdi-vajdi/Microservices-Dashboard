import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { AccountCreatedEvent } from '../../../Domain/events/account-created.event';
import { Inject } from '@nestjs/common';
import { AGENT_SERVICE } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';

@EventsHandler(AccountCreatedEvent)
export class AccountCreatedHandler
  implements IEventHandler<AccountCreatedEvent>
{
  constructor(
    @Inject(AGENT_SERVICE) private readonly agentCommandService: ClientProxy,
  ) {}

  async handle(event: AccountCreatedEvent): Promise<void> {
    // create a default agent when a new account created
    console.log('account created: ', event);
  }
}
