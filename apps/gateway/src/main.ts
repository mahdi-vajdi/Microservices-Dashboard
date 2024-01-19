import { NestFactory } from '@nestjs/core';
import { GatewayModule } from './gateway.module';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(GatewayModule, { bufferLogs: true });
  const configService = app.get(ConfigService);

  app.useLogger(app.get(Logger));
  app.use(cookieParser());
  app.setGlobalPrefix('dashboard');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  await app.listen(configService.getOrThrow('HTTP_PORT'));
}
bootstrap();
