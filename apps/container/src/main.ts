import { NestFactory } from '@nestjs/core';
import { ContainerModule } from './container.module';

async function bootstrap() {
  const app = await NestFactory.create(ContainerModule);
  await app.listen(3000);
}
bootstrap();
