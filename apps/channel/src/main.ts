import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ChannelModule } from './channel.module';
import { ValidationPipe } from '@nestjs/common';
import {
  CustomStrategy,
  MicroserviceOptions,
  Transport,
} from '@nestjs/microservices';
import { join } from 'path';
import { GRPC_CHANNEL } from '@app/common';
import { NatsJetStreamServer } from '@nestjs-plugins/nestjs-nats-jetstream-transport';

async function bootstrap() {
  const app = await NestFactory.create(ChannelModule);
  const configService = app.get(ConfigService);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  app.connectMicroservice<CustomStrategy>({
    strategy: new NatsJetStreamServer({
      connectionOptions: {
        servers: configService.getOrThrow<string>('NATS_URI'),
        name: 'channel-listener',
      },
      consumerOptions: {
        deliverGroup: 'channel-group',
        durable: 'channel-durable',
        deliverTo: 'channel-messages',
        manualAck: true,
      },
      streamConfig: {
        name: 'channelStream',
        subjects: ['channel.>'],
      },
    }),
  });

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: GRPC_CHANNEL,
      protoPath: join(__dirname, '../../../proto/channel.proto'),
      url: configService.getOrThrow('CHANNEL_GRPC_URL'),
    },
  });

  await app.init();
  await app.startAllMicroservices();
}
bootstrap();
