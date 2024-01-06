import { Module } from '@nestjs/common';
import { AccountNatsController } from './Presentation/account.nats-controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ACCOUNT_DB_COLLECTION,
  AccountSchema,
} from './Infrastructure/models/account.model';
import { CqrsModule } from '@nestjs/cqrs';
import { AccountCommandHandlers } from './Application/commands/handlers';
import { AccountQueryHandlers } from './Application/queries/handlers';
import { AccountEventHandlers } from './Application/events/handlers';
import { AccountQueryRepository } from './Infrastructure/repositories/account.query-repo';
import { AccountEntityRepositoryImpl } from './Infrastructure/repositories/impl-account.entity-repo';
import { AccountEntityRepository } from './Domain/base-account.entity-repo';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AGENT_NATS } from '@app/common';
import { AccountGrpcController } from './Presentation/account.grpc-controller';

@Module({
  imports: [
    CqrsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(),
        NATS_URI: Joi.string().required(),
        ACCOUNT_GRPC_URL: Joi.string().required(),
      }),
    }),
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: ACCOUNT_DB_COLLECTION, schema: AccountSchema },
    ]),
    ClientsModule.registerAsync([
      {
        name: AGENT_NATS,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.NATS,
          options: {
            servers: [configService.getOrThrow('NATS_URI')],
            queue: AGENT_NATS,
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [AccountNatsController, AccountGrpcController],
  providers: [
    AccountQueryRepository,
    { provide: AccountEntityRepository, useClass: AccountEntityRepositoryImpl },
    ...AccountCommandHandlers,
    ...AccountEventHandlers,
    ...AccountQueryHandlers,
  ],
})
export class AccountModule {}
