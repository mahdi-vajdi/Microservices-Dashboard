import { Controller, Get } from '@nestjs/common';

@Controller()
export class ContainerController {
  constructor() {}

  @Get()
  getHello(): string {
    throw new Error('Method not implemented.');
  }
}
