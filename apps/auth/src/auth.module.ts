import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGrpcController } from './auth.grpc-controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenStrategy } from './strategies/access-token.strategy';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ACCOUNT_SERVICE, AGENT_SERVICE } from '@app/common';
import { JwtHelperService } from './jwt-helper.service';
import { AuthNatsController } from './auth.nats-controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        HTTP_PORT: Joi.number().required(),
        NATS_URI: Joi.string().required(),
        JWT_ACCESS_SECRET: Joi.string().required(),
        JWT_REFRESH_SECRET: Joi.string().required(),
      }),
    }),
    ClientsModule.registerAsync([
      {
        name: AGENT_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.NATS,
          options: {
            servers: [configService.getOrThrow('NATS_URI')],
            queue: AGENT_SERVICE,
          },
        }),
        inject: [ConfigService],
      },
      {
        name: ACCOUNT_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.NATS,
          options: {
            servers: [configService.getOrThrow('NATS_URI')],
            queue: ACCOUNT_SERVICE,
          },
        }),
        inject: [ConfigService],
      },
    ]),
    JwtModule.register({}),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [AuthNatsController, AuthGrpcController],
  providers: [
    AuthService,
    AccessTokenStrategy,
    RefreshTokenStrategy,
    JwtHelperService,
  ],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
