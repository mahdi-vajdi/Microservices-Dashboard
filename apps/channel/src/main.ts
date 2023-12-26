import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ChannelModule } from './channel.module';
import { ValidationPipe } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(ChannelModule);
  const configService = app.get(ConfigService);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  app.connectMicroservice({
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
