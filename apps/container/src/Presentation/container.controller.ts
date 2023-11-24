import { AccessTokenGuard } from '@app/common';
import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';

@Controller()
export class ContainerController {
  constructor() {}

  @UseGuards(AccessTokenGuard)
  @Get()
  getHello(@Req() req: Request) {
    console.log(`constainer service: controller: user: ${req.user!}`);
  }
}
