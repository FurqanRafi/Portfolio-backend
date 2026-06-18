import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

Specs Fixing  describe('root health', () => {
    it('should return API health status', () => {
      expect(appController.getHealth()).toEqual(
        expect.objectContaining({
          status: 'ok',
          message: 'Portfolio API is running',
          version: '1.0.0',
        }),
      );
    });
  });
});
