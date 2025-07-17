import { Test, TestingModule } from '@nestjs/testing';
import { AdminServerController } from './admin-server.controller';
import { AdminServerService } from './admin-server.service';

describe('AdminServerController', () => {
  let adminServerController: AdminServerController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AdminServerController],
      providers: [AdminServerService],
    }).compile();

    adminServerController = app.get<AdminServerController>(AdminServerController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(adminServerController.getHello()).toBe('Hello World!');
    });
  });
});
