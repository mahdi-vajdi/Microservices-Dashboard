import { NestFactory } from '@nestjs/core';
import { AgentModule } from './agent.module';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AgentModule);
  const configService = app.get(ConfigService);

  app.use(cookieParser());

  await app.listen(configService.getOrThrow('HTTP_PORT'));
}
bootstrap();
