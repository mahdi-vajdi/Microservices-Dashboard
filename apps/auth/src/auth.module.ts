import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthGrpcController } from './controllers/auth.grpc-controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ACCOUNT_NATS, AGENT_NATS } from '@app/common';
import { JwtHelperService } from './services/jwt-helper.service';
import { AuthNatsController } from './controllers/auth.nats-controller';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        JWT_ACCESS_SECRET: Joi.string().required(),
        JWT_REFRESH_SECRET: Joi.string().required(),
        NATS_URI: Joi.string().required(),
        AUTH_GRPC_URL: Joi.string().required(),
        ACCOUNT_GRPC_URL: Joi.string().required(),
        AGENT_GRPC_URL: Joi.string().required(),
      }),
    }),
    JwtModule.register({}),
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
      {
        name: 'AGENT_PACKAGE',
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: 'agent',
            protoPath: join(__dirname, '../../../proto/agent.proto'),
            url: configService.getOrThrow('AGENT_GRPC_URL'),
          },
        }),
        inject: [ConfigService],
      },
      {
        name: ACCOUNT_NATS,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.NATS,
          options: {
            servers: [configService.getOrThrow('NATS_URI')],
            queue: ACCOUNT_NATS,
          },
        }),
        inject: [ConfigService],
      },
      {
        name: 'ACCOUNT_PACKAGE',
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: 'account',
            protoPath: join(__dirname, '../../../proto/account.proto'),
            url: configService.getOrThrow('ACCOUNT_GRPC_URL'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
    ClientsModule.register([]),
  ],
  controllers: [AuthNatsController, AuthGrpcController],
  providers: [AuthService, JwtHelperService],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
