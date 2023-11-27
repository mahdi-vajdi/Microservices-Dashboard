import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { ChannelModule } from './channel.module';

async function bootstrap() {
  const app = await NestFactory.create(ChannelModule);
  const configService = app.get(ConfigService);

  app.use(cookieParser());

  await app.listen(configService.getOrThrow('HTTP_PORT'));
}
bootstrap();
