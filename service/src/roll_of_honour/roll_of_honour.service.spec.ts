import { Test, TestingModule } from '@nestjs/testing';
import { RollOfHonourService } from './roll_of_honour.service';

describe('RollOfHonourService', () => {
  let service: RollOfHonourService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RollOfHonourService],
    }).compile();

    service = module.get<RollOfHonourService>(RollOfHonourService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
