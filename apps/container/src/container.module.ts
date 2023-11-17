import { Module } from '@nestjs/common';
import { ContainerController } from './Presentation/container.controller';

@Module({
  imports: [],
  controllers: [ContainerController],
})
export class ContainerModule {}
