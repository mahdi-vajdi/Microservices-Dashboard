import { Test, TestingModule } from '@nestjs/testing';
import { ContainerController } from './container.controller';
import { ContainerService } from './container.service';

describe('ContainerController', () => {
  let containerController: ContainerController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ContainerController],
      providers: [ContainerService],
    }).compile();

    containerController = app.get<ContainerController>(ContainerController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(containerController.getHello()).toBe('Hello World!');
    });
  });
});
