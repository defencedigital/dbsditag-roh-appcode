import { DataSource } from 'typeorm';
import { RollOfHonour } from './roll_of_honour.entity';
import { Revisions } from './revisions.entity';
import { ConfigService } from 'src/services/config.service';

export const rollOfHonourProviders = [
  {
    provide: ConfigService.ROLL_OF_HONOUR_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(RollOfHonour),
    inject: [ConfigService.DATA_SOURCE],
  },
  {
    provide: ConfigService.REVISIONS_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Revisions),
    inject: [ConfigService.DATA_SOURCE],
  },
];
