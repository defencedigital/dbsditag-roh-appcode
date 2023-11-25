import { ConfigService } from 'src/services';
import { DataSource } from 'typeorm';

export const databaseProviders = [
  {
    provide: ConfigService.DATA_SOURCE,
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'sqlite',
        database: 'afmd.db',
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: true,
        dropSchema: false,
      });

      return dataSource.initialize();
    },
  },
];
