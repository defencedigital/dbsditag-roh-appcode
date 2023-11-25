import { Test, TestingModule } from '@nestjs/testing';
import { ModloginController } from './modlogin.controller';

describe('ModloginController', () => {
  let controller: ModloginController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ModloginController],
    }).compile();

    controller = module.get<ModloginController>(ModloginController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
