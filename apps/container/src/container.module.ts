import { Module } from '@nestjs/common';
import { ContainerController } from './Presentation/container.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AGENT_SERVICE, AUTH_SERVICE } from '@app/common/constants';
import { ContainerRepository } from './Domain/base-container.repo';
import { ContainerWriteRepository } from './Infrastructure/repositories/container-write.repo';
import { ContainerCommandHandlers } from './Application/commands/handlers';
import { ContainerQueryHandlers } from './Application/queries/handlers';
import { ContainerReadRepository } from './Infrastructure/repositories/container-read.repo';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ContainerModel,
  ContainerSchema,
} from './Infrastructure/models/container.model';
import { CqrsModule } from '@nestjs/cqrs';

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
    MongooseModule.forFeature([
      { name: ContainerModel.name, schema: ContainerSchema },
    ]),
    ClientsModule.registerAsync([
      {
        name: AUTH_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.NATS,
          options: {
            servers: [configService.getOrThrow('NATS_URI')],
          },
        }),
        inject: [ConfigService],
      },
      {
        name: AGENT_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.NATS,
          options: {
            servers: [configService.getOrThrow('NATS_URI')],
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [ContainerController],
  providers: [
    { provide: ContainerRepository, useClass: ContainerWriteRepository },
    ContainerReadRepository,
    ...ContainerCommandHandlers,
    ...ContainerQueryHandlers,
  ],
})
export class ContainerModule {}
