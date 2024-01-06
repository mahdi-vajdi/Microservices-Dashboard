import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { AccountCreatedEvent } from '../../../Domain/events/account-created.event';
import { Inject, Logger } from '@nestjs/common';
import { AGENT_NATS } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';

@EventsHandler(AccountCreatedEvent)
export class AccountCreatedHandler
  implements IEventHandler<AccountCreatedEvent>
{
  private readonly logger = new Logger(AccountCreatedHandler.name);
  constructor(
    @Inject(AGENT_NATS) private readonly agentCommandService: ClientProxy,
  ) {}

  async handle(event: AccountCreatedEvent): Promise<void> {
    // create a default agent when a new account created
    this.logger.log('account created: ', event);
  }
}
