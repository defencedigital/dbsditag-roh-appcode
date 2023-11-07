import { Module } from '@nestjs/common';
import { CookiePolicyController } from './cookie-policy.controller';
import { CookiePolicyService } from './cookie-policy.service';

@Module({
  imports: [],
  controllers: [CookiePolicyController],
  providers: [CookiePolicyService],
})
export class CookiePolicyModule {}
