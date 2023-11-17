import { Module } from '@nestjs/common';
import { ContainerController } from './container.controller';
import { ContainerService } from './container.service';

@Module({
  imports: [],
  controllers: [ContainerController],
  providers: [ContainerService],
})
export class ContainerModule {}
