import { Module } from '@nestjs/common';
import { RollOfHonourService } from './roll_of_honour.service';
import { DatabaseModule } from '../database/database.module';
import { rollOfHonourProviders } from './roll_of_honour.providers';

@Module({
  imports: [DatabaseModule],
  providers: [...rollOfHonourProviders, RollOfHonourService],
})
export class RollOfHonourModule {}
