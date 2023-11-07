import { Inject, Injectable } from '@nestjs/common';
import { RollOfHonour } from './roll_of_honour.entity';
import { Repository } from 'typeorm';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { ConfigService } from 'src/services/config.service';
import { Revisions } from './revisions.entity';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import RollOfHonourDryRunDTO from './roll_of_honour_dry_run.dto';
import { RollOfHonourRecord, TableNames } from 'src/types/types';
import { randomUUID } from 'crypto';
import { RollOfHonourDryRun } from './roll_of_honour_dry_run.entity';

interface AddRecordsBatchArgs {
  recordsToInsert: RollOfHonourRecord[];
  modMail: string;
  notifyVerificationEmailId: string;
}

@Injectable()
export class RollOfHonourService {
  constructor(
    @Inject(ConfigService.ROLL_OF_HONOUR_REPOSITORY)
    private repository: Repository<RollOfHonour>,
    @Inject(ConfigService.REVISIONS_REPOSITORY)
    private revisionsRepository: Repository<Revisions>,
  ) { }

  async findAll() {
    return this.repository.find();
  }

  searchInLowercase(searchTerm: string, tableName = 'RollOfHonour') {
    return `LOWER(${tableName}.${searchTerm}) LIKE LOWER(:${searchTerm})`;
  }

  async search({
    page,
    limit,
    route,
    service,
    surname,
    forenames,
    service_number,
  }): Promise<Pagination<RollOfHonour>> {
    const queryBuilder = this.repository
      .createQueryBuilder('RollOfHonour')
      .orderBy(ConfigService.SURNAME, 'ASC')
      .addOrderBy(ConfigService.FORENAMES, 'ASC');

    if (forenames) {
      queryBuilder.andWhere(this.searchInLowercase(ConfigService.FORENAMES), {
        forenames: `%${forenames}%`,
      });
    }

    if (surname) {
      queryBuilder.andWhere(this.searchInLowercase(ConfigService.SURNAME), {
        surname: `%${surname}%`,
      });
    }

    if (service_number.length > 0) {
      service_number = service_number.replace(/\s/g, '').toString();

      queryBuilder.andWhere('RollOfHonour.service_no LIKE (:service_number)', {
        service_number: `%${service_number}%`,
      });
    }

    if (service != 'any') {
      queryBuilder.andWhere('RollOfHonour.service IN (:...service)', {
        service: service,
      });
    }

    return paginate<RollOfHonour>(queryBuilder, { page, limit, route });
  }

  async get(id): Promise<RollOfHonour> {
    return this.repository.findOneBy({ id: id });
  }

  async deleteAllRecords(tableName: TableNames) {
    await this.repository.manager.query(
      `${ConfigService.DELETE} ${ConfigService.FROM} ${tableName};`,
    );
  }

  splitArrayIntoChuncks(arr, chunkSize = 1000) {
    let result = [];

    for (let i = 0; i < arr.length; i += chunkSize) {
      result.push(arr.slice(i, i + chunkSize));
    }

    return result;
  }

  async addRecordsBatch({ recordsToInsert, modMail, notifyVerificationEmailId }: AddRecordsBatchArgs) {
    const queryRunner = this.repository.manager.connection.createQueryRunner();

    try {
      const chunckedData = this.splitArrayIntoChuncks(recordsToInsert, 1000);
      await queryRunner.connect();
      await queryRunner.startTransaction();
      await this.deleteAllRecords(
        ConfigService.tableNames.ROLL_OF_HONOUR_DRY_RUN,
      );
      let dbRes = { identifiers: [] };

      for (const currentChunck of chunckedData) {
        const { identifiers } = await this.repository
          .createQueryBuilder()
          .insert()
          .into(RollOfHonourDryRun)
          .values(currentChunck)
          .execute();
        dbRes.identifiers.push(...identifiers);
      }



      await this.addRevisionDetails({
        updatedBy: notifyVerificationEmailId,
        tableUpdated: ConfigService.tableNames.ROLL_OF_HONOUR_DRY_RUN,
      });
      await queryRunner.commitTransaction();

      return dbRes;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new Error(err);
    } finally {
      await queryRunner.release();
    }
  }

  async addRevisionDetails({
    updatedBy = 'unknown',
    tableUpdated,
  }: {
    updatedBy?: string;
    tableUpdated: TableNames;
  }) {
    const id = randomUUID();
    const timestamp = Date.now();
    const formattedDate = this.formatTimestampToDate(timestamp);

    const record = {
      id,
      updated_by: updatedBy,
      table_updated: tableUpdated,
      timestamp,
      updated_at: formattedDate,
    };

    await this.repository
      .createQueryBuilder()
      .insert()
      .into(Revisions)
      .values(record)
      .execute();
  }

  addLeadingZero(time: number) {
    const timeString = time?.toString();
    return timeString?.length > 0 && timeString?.length < 2
      ? time.toString().padStart(2, '0')
      : time;
  }

  formatTimestampToDate(timestamp: number) {
    const date = new Date(timestamp);
    const day = this.addLeadingZero(date.getDate());
    const month = this.addLeadingZero(date.getMonth() + 1);
    const year = this.addLeadingZero(date.getFullYear());
    const hours = this.addLeadingZero(date.getHours());
    const minutes = this.addLeadingZero(date.getMinutes());
    const seconds = this.addLeadingZero(date.getSeconds());

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  }

  async transferToMainDB({ updatedBy }: { updatedBy: string }) {
    const deleteAllRecordsQuery = `${ConfigService.DELETE} ${ConfigService.FROM} ${ConfigService.tableNames.ROLL_OF_HONOUR};`;
    const copyToMainTableQuery = `${ConfigService.INSERT} ${ConfigService.INTO} ${ConfigService.tableNames.ROLL_OF_HONOUR} (${ConfigService.databaseCols}) ${ConfigService.SELECT} ${ConfigService.databaseCols} ${ConfigService.FROM} ${ConfigService.tableNames.ROLL_OF_HONOUR_DRY_RUN};`;
    const queryRunner = this.repository.manager.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await this.repository.manager.query(deleteAllRecordsQuery);
      const moveRecordsResponse = await this.repository.manager.query(
        copyToMainTableQuery,
      );
      // add the details of the revision details
      await this.addRevisionDetails({
        updatedBy: updatedBy,
        tableUpdated: ConfigService.tableNames.ROLL_OF_HONOUR,
      });

      await queryRunner.commitTransaction();
      return moveRecordsResponse;
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  getValueStrings(line: string) {
    const colValues: string[] = [];
    let currentvalue = '';
    let isInQuotes = false;

    // ignore the ',' character values inside double quotes. Stops problems with the columns aligning incorrectly with the data when extra ',' charcters are use din the data
    for (const element of line) {
      const character = element;
      if (character === '"') {
        isInQuotes = !isInQuotes;
      } else if (character === ',' && !isInQuotes) {
        colValues.push(currentvalue.trim());
        currentvalue = '';
      } else {
        currentvalue += character;
      }
    }

    if (currentvalue) colValues.push(currentvalue.trim());

    return colValues.map((string) => string.replace(/"/g, ''));
  }

  hasCorrectNumberOfCols(line: string[]) {
    return line?.length === Object.keys(ConfigService.headerMap).length - 1;
  }

  async normalizeData(record) {
    let normalisedRecord = record;
    if (record.memorial === '********') record.memorial = 'unknown';

    return normalisedRecord;
  }

  async getLastUpdatedDate(): Promise<Revisions[]> {
    try {
      return await this.revisionsRepository.find({
        where: { table_updated: ConfigService.tableNames.ROLL_OF_HONOUR },
        order: { timestamp: 'DESC' },
        take: 1,
      })
    } catch (error) {
    }
  }
  async getIsValidRecord(record) {
    let recordValidationClass = plainToInstance(RollOfHonourDryRunDTO, record);
    let errors = await validate(recordValidationClass);

    return !errors?.length;
  }
}
