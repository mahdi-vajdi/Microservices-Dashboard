import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AccountModule } from './account.module';
import {
  CustomStrategy,
  MicroserviceOptions,
  Transport,
} from '@nestjs/microservices';
import { GRPC_ACCOUNT } from '@app/common';
import { join } from 'path';
import { NatsJetStreamServer } from '@nestjs-plugins/nestjs-nats-jetstream-transport';

async function bootstrap() {
  const app = await NestFactory.create(AccountModule);
  const configService = app.get(ConfigService);

  app.connectMicroservice<CustomStrategy>({
    strategy: new NatsJetStreamServer({
      connectionOptions: {
        servers: configService.getOrThrow<string>('NATS_URI'),
        name: 'account-listener',
      },
      consumerOptions: {
        deliverGroup: 'account-group',
        durable: 'account-durable',
        deliverTo: 'account-messages',
        manualAck: true,
      },
      streamConfig: {
        name: 'accountStream',
        subjects: ['account.>'],
      },
    }),
  });
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: GRPC_ACCOUNT,
      protoPath: join(__dirname, '../../../proto/account.proto'),
      url: configService.getOrThrow('ACCOUNT_GRPC_URL'),
    },
  });

  await app.init();
  await app.startAllMicroservices();
}
bootstrap();
