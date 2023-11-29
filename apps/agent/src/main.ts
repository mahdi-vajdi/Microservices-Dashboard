import { NestFactory } from '@nestjs/core';
import { AgentModule } from './agent.module';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AGENT_SERVICE } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(AgentModule);
  const configService = app.get(ConfigService);

  app.use(cookieParser());
  app.setGlobalPrefix('dashboard');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.NATS,
    options: {
      servers: [configService.getOrThrow('NATS_URI')],
      queue: AGENT_SERVICE,
    },
  });

  await app.startAllMicroservices();
  await app.listen(configService.getOrThrow('HTTP_PORT'));
}
bootstrap();
