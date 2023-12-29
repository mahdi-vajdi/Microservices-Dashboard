import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ChannelModule } from './channel.module';
import { ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { CHANNEL_SERVICE } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(ChannelModule);
  const configService = app.get(ConfigService);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.NATS,
    options: {
      servers: [configService.getOrThrow('NATS_URI')],
      queue: CHANNEL_SERVICE,
    },
  });

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'channel',
      protoPath: join(__dirname, '../../../proto/channel.proto'),
      url: configService.getOrThrow('CHANNEL_GRPC_URL'),
    },
  });

  await app.init();
  await app.startAllMicroservices();
}
bootstrap();
