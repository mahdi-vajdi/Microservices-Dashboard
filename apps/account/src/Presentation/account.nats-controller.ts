import { Controller } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateAccountDto } from '../Application/dto/create-account.dto';
import { CreateAccountCommand } from '../Application/commands/impl/create-account.command';
import { Ctx, EventPattern, Payload } from '@nestjs/microservices';
import { AccountSubjects } from '@app/common';
import { NatsJetStreamContext } from '@nestjs-plugins/nestjs-nats-jetstream-transport';

@Controller()
export class AccountNatsController {
  constructor(private readonly commandBus: CommandBus) {}

  @EventPattern(AccountSubjects.CREATE_ACCOUNT)
  async createAccount(
    @Payload() { email }: CreateAccountDto,
    @Ctx() context: NatsJetStreamContext,
  ): Promise<void> {
    await this.commandBus.execute<CreateAccountCommand, void>(
      new CreateAccountCommand(email),
    );
    context.message.ack();
  }
}
