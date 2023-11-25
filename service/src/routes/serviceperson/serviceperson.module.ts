import { Module } from '@nestjs/common';
import { RollOfHonourService } from 'src/roll_of_honour/roll_of_honour.service';
import { ServicepersonService } from './serviceperson.service';
import { rollOfHonourProviders } from 'src/roll_of_honour/roll_of_honour.providers';
import { DatabaseModule } from 'src/database/database.module';
import { ServicepersonController } from './serviceperson.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [ServicepersonController],
  providers: [
    ServicepersonService,
    RollOfHonourService,
    ...rollOfHonourProviders,
  ],
})
export class ServicepersonModule {}
