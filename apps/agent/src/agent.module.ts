import { Module } from '@nestjs/common';
import { AgentHttpController } from './Presentation/agent.http-controller';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { MongooseModule } from '@nestjs/mongoose';
import { AgentModel, AgentSchema } from './Infrastructure/models/agent.model';
import { AgentEntityRepositoryImpl } from './Infrastructure/repositories/impl-agent.entity-repo';
import { AgentQueryepository } from './Infrastructure/repositories/agent.query-repo';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AUTH_SERVICE } from '@app/common';
import { AgentCommandHandlers } from './Application/commands/handlers';
import { AgentQueryHandlers } from './Application/queries/handlers';
import { AgentEntityRepository } from './Domain/base-agent.entity-repo';
import { AgentNatsController } from './Presentation/agent.nats-cotroller';

@Module({
  imports: [
    CqrsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        HTTP_PORT: Joi.number().required(),
        MONGODB_URI: Joi.string().required(),
        NATS_URI: Joi.string().required(),
      }),
    }),
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([{ name: AgentModel.name, schema: AgentSchema }]),
    ClientsModule.registerAsync([
      {
        name: AUTH_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.NATS,
          options: {
            servers: [configService.getOrThrow('NATS_URI')],
            queue: AUTH_SERVICE,
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [AgentHttpController, AgentNatsController],
  providers: [
    { provide: AgentEntityRepository, useClass: AgentEntityRepositoryImpl },
    AgentQueryepository,
    ...AgentCommandHandlers,
    ...AgentQueryHandlers,
  ],
})
export class AgentModule {}
