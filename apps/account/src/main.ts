import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AccountModule } from './account.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import { ACCOUNT_SERVICE } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(AccountModule);
  const configService = app.get(ConfigService);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.NATS,
    options: {
      servers: [configService.getOrThrow('NATS_URI')],
      queue: ACCOUNT_SERVICE,
    },
  });
  await app.startAllMicroservices();
}
bootstrap();
