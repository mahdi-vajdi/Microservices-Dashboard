import { Module } from '@nestjs/common';
import { AgentHttpController } from './Presentation/agent.http-controller';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { MongooseModule } from '@nestjs/mongoose';
import { AgentModel, AgentSchema } from './Infrastructure/models/agent.model';
import { AgentEntityRepositoryImpl } from './Infrastructure/repositories/impl-agent.entity-repo';
import { AgentQueryRepository } from './Infrastructure/repositories/agent.query-repo';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
  AUTH_PACKAGE_NAME,
  AUTH_SERVICE,
  AUTH_SERVICE_NAME,
} from '@app/common';
import { AgentCommandHandlers } from './Application/commands/handlers';
import { AgentQueryHandlers } from './Application/queries/handlers';
import { AgentEntityRepository } from './Domain/base-agent.entity-repo';
import { AgentNatsController } from './Presentation/agent.nats-cotroller';
import { join } from 'path';

@Module({
  imports: [
    CqrsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        HTTP_PORT: Joi.number().required(),
        MONGODB_URI: Joi.string().required(),
        NATS_URI: Joi.string().required(),
        AUTH_GRPC_URL: Joi.string().required(),
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
      {
        name: AUTH_SERVICE_NAME,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: AUTH_PACKAGE_NAME,
            protoPath: join(__dirname, '../../../proto/auth.proto'),
            url: configService.getOrThrow('AUTH_GRPC_URL'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [AgentHttpController, AgentNatsController],
  providers: [
    { provide: AgentEntityRepository, useClass: AgentEntityRepositoryImpl },
    AgentQueryRepository,
    ...AgentCommandHandlers,
    ...AgentQueryHandlers,
  ],
})
export class AgentModule {}
