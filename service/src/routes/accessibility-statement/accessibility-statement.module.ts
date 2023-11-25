import { Module } from '@nestjs/common';
import { AccessibilityStatementController } from './accessibility-statement.controller';

@Module({
  imports: [],
  controllers: [AccessibilityStatementController],
  providers: [],
})
export class AccessibilityStatementModule {}
