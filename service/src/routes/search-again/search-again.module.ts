import { Module } from '@nestjs/common';
import { SearchAgainController } from './search-again.controller';

@Module({
  controllers: [SearchAgainController],
})
export class SearchAgainModule {}
