import { Injectable } from '@nestjs/common';

@Injectable()
export class ContainerService {
  getHello(): string {
    return 'Hello World!';
  }
}
