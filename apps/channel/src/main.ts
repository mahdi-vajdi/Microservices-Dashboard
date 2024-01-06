import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ChannelModule } from './channel.module';
import { ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { NATS_CHANNEL, GRPC_CHANNEL } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(ChannelModule);
  const configService = app.get(ConfigService);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.NATS,
    options: {
      servers: [configService.getOrThrow('NATS_URI')],
      queue: NATS_CHANNEL,
    },
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
