import { Module } from '@nestjs/common';
import { ChannelController } from './Presentation/channel.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AGENT_SERVICE, AUTH_SERVICE } from '@app/common/constants';
import { ChannelRepository } from './Domain/base-channel.repo';
import { ChannelWriteRepository } from './Infrastructure/repositories/channel-write.repo';
import { ChannelChannelHandlers } from './Application/commands/handlers';
import { ChannelQueryHandlers } from './Application/queries/handlers';
import { ChannelReadRepository } from './Infrastructure/repositories/channel-read.repo';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ChannelModel,
  ChannelSchema,
} from './Infrastructure/models/channel.model';
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
      { name: ChannelModel.name, schema: ChannelSchema },
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
  controllers: [ChannelController],
  providers: [
    { provide: ChannelRepository, useClass: ChannelWriteRepository },
    ChannelReadRepository,
    ...ChannelChannelHandlers,
    ...ChannelQueryHandlers,
  ],
})
export class ChannelModule {}
