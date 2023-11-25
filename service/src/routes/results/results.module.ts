import { Module } from '@nestjs/common';
import { RollOfHonourService } from 'src/roll_of_honour/roll_of_honour.service';
import { ResultsService } from './results.service';
import { rollOfHonourProviders } from 'src/roll_of_honour/roll_of_honour.providers';
import { DatabaseModule } from 'src/database/database.module';
import { ResultsController } from './results.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [ResultsController],
  providers: [ResultsService, RollOfHonourService, ...rollOfHonourProviders],
})
export class ResultsModule {}
