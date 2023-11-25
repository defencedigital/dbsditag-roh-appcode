import { Module } from '@nestjs/common';
import { PrivacyPolicyController } from './privacy-policy.controller';

@Module({
  imports: [],
  controllers: [PrivacyPolicyController],
  providers: [],
})
export class PrivacyPolicyModule {}
