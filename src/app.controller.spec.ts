import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';

describe('AppController', () => {
  let appController: AppController;
  let prismaService: { $queryRaw: jest.Mock };

  beforeEach(async () => {
    prismaService = {
      $queryRaw: jest.fn().mockResolvedValue([{ result: 1 }]),
    };

    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: PrismaService,
          useValue: prismaService,
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root health', () => {
    it('should return API health status', () => {
      expect(appController.getHealth()).toEqual(
        expect.objectContaining({
          status: 'ok',
          message: 'Portfolio API is running',
          version: '1.0.0',
        }),
      );
    });

    it('should return database health status', async () => {
      await expect(appController.getDatabaseHealth()).resolves.toEqual(
        expect.objectContaining({
          status: 'ok',
          database: 'connected',
        }),
      );
      expect(prismaService.$queryRaw).toHaveBeenCalled();
    });
  });
});
