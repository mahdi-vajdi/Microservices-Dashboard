import { Controller, Get } from '@nestjs/common';
import { ContainerService } from './container.service';

@Controller()
export class ContainerController {
  constructor(private readonly containerService: ContainerService) {}

  @Get()
  getHello(): string {
    return this.containerService.getHello();
  }
}
