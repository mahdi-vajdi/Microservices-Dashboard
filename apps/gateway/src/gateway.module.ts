import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
  AUTH_PACKAGE_NAME,
  AUTH_SERVICE,
  AUTH_SERVICE_NAME,
} from '@app/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthHttpGateway } from './http-gateways/auth.http-gateway';
import { join } from 'path';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        HTTP_PORT: Joi.number().required(),
        NATS_URI: Joi.string().required(),
        AUTH_GRPC_URL: Joi.string().required(),
      }),
    }),
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
  controllers: [AuthHttpGateway],
  providers: [],
})
export class GatewayModule {}
