import { Test, TestingModule } from '@nestjs/testing';
import { AccessibilityStatementController } from './accessibility-statement.controller';

describe('AccessibilityStatementController', () => {
  let controller: AccessibilityStatementController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccessibilityStatementController],
    }).compile();

    controller = module.get<AccessibilityStatementController>(
      AccessibilityStatementController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
