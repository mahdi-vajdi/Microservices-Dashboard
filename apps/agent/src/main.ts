import { NestFactory } from '@nestjs/core';
import { AgentModule } from './agent.module';

async function bootstrap() {
  const app = await NestFactory.create(AgentModule);
  await app.listen(3000);
}
bootstrap();
