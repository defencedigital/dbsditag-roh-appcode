import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import RollOfHonourDryRunDTO from '../../roll_of_honour/roll_of_honour_dry_run.dto';
import { RollOfHonourRecord } from 'src/types/types';
import { ConfigService } from '../../services';


interface ExtractRecords {
  csvHeaders: string[];
  csvData: string[];
  shouldKeepAllRecords: boolean;
}

@Injectable()
export class UpdateService {
  getValueStrings(line: string) {
    const arrayOfStrings: string[] = [];
    let currentString = '';
    let isInQuotes = false;

    // ignore the ',' character values inside double quotes. Stops problems with the columns aligning incorrectly with the data when extra ',' charcters are used in the data
    for (const element of line) {
      const character = element;
      if (character === '"') {
        isInQuotes = !isInQuotes;
      } else if (character === ',' && !isInQuotes) {
        arrayOfStrings.push(currentString.trim());
        currentString = '';
      } else {
        currentString += character;
      }
    }

    if (currentString) arrayOfStrings.push(currentString.trim());

    return arrayOfStrings.map((string) => string.replace(/"/g, ''));
  }

  hasCorrectNumberOfCols(line: string[]) {
    return line?.length === Object.keys(ConfigService.headerMap).length - 1;
  }

  normalizeRecord(record: RollOfHonourRecord): RollOfHonourRecord {
    let normalisedRecord = record;
    if (record.memorial === '********') record.memorial = 'unknown';

    return normalisedRecord;
  }

  async getIsValidRecord(record) {
    let recordValidationClass = plainToInstance(RollOfHonourDryRunDTO, record);
    let errors = await validate(recordValidationClass);

    return !errors?.length;
  }

  getRecordFromStringValues(csvHeaders: string[], values: string[]) {
    const record = {} as RollOfHonourRecord;

    csvHeaders.forEach((header, index) => {
      if (header.trim() === 'PkId') {
        const integerPKID = parseInt(values[index]);
        record[ConfigService.headerMap[header?.trim()]] = integerPKID;
      } else {
        const trimmedValue = values[index]?.trim?.();
        record[ConfigService.headerMap[header?.trim()]] =
          trimmedValue === '' ? null : trimmedValue;
        // record.id = randomUUID();
      }
    });
    return record;
  }

  async extractRecords({
    csvHeaders,
    csvData,
    shouldKeepAllRecords,
  }: ExtractRecords) {
    let totalInvalidRecords = 0;
    let invalidRecordIds: string[] = [];
    const finalRecords: RollOfHonourRecord[] = [];

    for (const line in csvData) {
      const values = this.getValueStrings(csvData[line]);

      if (!this.hasCorrectNumberOfCols(values)) {
        totalInvalidRecords++;
        // don't include any records if they have the wrong amount of columns as it will cause issues
        continue;
      }
      const record = this.getRecordFromStringValues(csvHeaders, values);

      const isValidRecord = await this.getIsValidRecord(record);
      if (isValidRecord === false) {
        totalInvalidRecords++;
        if (record.service_no) invalidRecordIds.push(record.service_no);
        if (shouldKeepAllRecords) {
          finalRecords.push(this.normalizeRecord(record));
        }
      } else {
        finalRecords.push(this.normalizeRecord(record));
      }
    }

    return { finalRecords, totalInvalidRecords, invalidRecordIds };
  }

  async getDataFromCSV(
    file: Express.Multer.File,
    shouldKeepAllRecords = false,
  ) {
    try {
      const csvFileBuffer = file.buffer;
      const csvString = csvFileBuffer.toString();
      const lines = csvString.split('\r');
      const csvHeaders = lines[0].replace(/"/g, '').split(',');
      const csvData = lines.slice(1, lines.length);

      const { finalRecords, totalInvalidRecords, invalidRecordIds } =
        await this.extractRecords({
          csvHeaders,
          csvData,
          shouldKeepAllRecords,
        });

      return {
        csvData,
        allRecords: finalRecords,
        totalInvalidRecords,
        invalidRecordIds,
      };
    } catch (err) {
      throw new Error(err);
    }
  }
}
