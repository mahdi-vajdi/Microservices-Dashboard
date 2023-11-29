import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { AccountModule } from './account.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import { ACCOUNT_SERVICE } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(AccountModule);
  const configService = app.get(ConfigService);

  app.use(cookieParser());
  app.setGlobalPrefix('dashboard');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.NATS,
    options: {
      servers: [configService.getOrThrow('NATS_URI')],
      queue: ACCOUNT_SERVICE,
    },
  });
  await app.startAllMicroservices();
  await app.listen(configService.getOrThrow('HTTP_PORT'));
}
bootstrap();
