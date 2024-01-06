import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AccountModule } from './account.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import { NATS_ACCOUNT, GRPC_ACCOUNT } from '@app/common';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AccountModule);
  const configService = app.get(ConfigService);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.NATS,
    options: {
      servers: [configService.getOrThrow('NATS_URI')],
      queue: NATS_ACCOUNT,
    },
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
