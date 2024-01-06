import { NestFactory } from '@nestjs/core';
import { AgentModule } from './agent.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { NATS_AGENT, GRPC_AGENT } from '@app/common';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AgentModule);
  const configService = app.get(ConfigService);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.NATS,
    options: {
      servers: [configService.getOrThrow('NATS_URI')],
      queue: NATS_AGENT,
    },
  });
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: GRPC_AGENT,
      protoPath: join(__dirname, '../../../proto/agent.proto'),
      url: configService.getOrThrow('AGENT_GRPC_URL'),
    },
  });

  await app.init();
  await app.startAllMicroservices();
}
bootstrap();
