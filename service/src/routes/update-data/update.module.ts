import { Module } from '@nestjs/common';
import { UpdateService } from './update.service';
import { UpdateDataController } from './update.controller';
import { RollOfHonourService } from 'src/roll_of_honour/roll_of_honour.service';
import { rollOfHonourProviders } from 'src/roll_of_honour/roll_of_honour.providers';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [UpdateDataController],
  providers: [UpdateService, RollOfHonourService, ...rollOfHonourProviders],
})
export class UpdateModule { }
