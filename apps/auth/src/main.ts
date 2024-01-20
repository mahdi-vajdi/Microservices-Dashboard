import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import {
  CustomStrategy,
  MicroserviceOptions,
  Transport,
} from '@nestjs/microservices';
import { GRPC_AUTH } from '@app/common';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import { NatsJetStreamServer } from '@nestjs-plugins/nestjs-nats-jetstream-transport';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule, { bufferLogs: true });

  const configService = app.get<ConfigService>(ConfigService);

  app.useLogger(app.get(Logger));

  app.connectMicroservice<CustomStrategy>({
    strategy: new NatsJetStreamServer({
      connectionOptions: {
        servers: configService.getOrThrow<string>('NATS_URI'),
        name: 'auth-listener',
      },
      consumerOptions: {
        deliverGroup: 'auth-group',
        durable: 'auth-durable',
        deliverTo: 'auth-messages',
        manualAck: true,
      },
      streamConfig: {
        name: 'authStream',
        subjects: ['auth.*'],
      },
    }),
  });

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: GRPC_AUTH,
      protoPath: join(__dirname, '../../../proto/auth.proto'),
      url: configService.getOrThrow('AUTH_GRPC_URL'),
    },
  });

  await app.init();
  await app.startAllMicroservices();
}
bootstrap();
