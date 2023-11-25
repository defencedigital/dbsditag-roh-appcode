import {
  Controller,
  Get,
  Post,
  Render,
  Req,
  Res,
  Session,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  BadRequestException,
  UseGuards,
  UseFilters,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ValidateFileIsImage } from '../../pipes/validate-file-is-image';
import { RollOfHonourService } from 'src/roll_of_honour/roll_of_honour.service';
import { UploadGuard } from '../../guards/upload-guard';
import { UnauthorizedUploaderFilter } from '../../filters/unauthorized-uploader.filter';
import {
  CheckboxOptions,
  FileUploadOptions,
  IRequest,
  ISession,
  SetUploadMetricsArguments,
} from 'src/types/types';
import { InvalidFileFilter } from 'src/filters/invalid-file.filter';
import { Csrf } from 'ncsrf';

import BaseDto from './baseDto';
import { UpdateDataBadRequestExceptionFilter } from 'src/filters/update-data-bad-request-exception.filter';
import { Throttle } from '@nestjs/throttler';
import { UpdateService } from './update.service';
import { ConfigService } from 'src/services/config.service';
import { Locals } from 'src/decorators/locals.decorator';

const setUploadMetrics = ({
  session,
  dataUpdateInfo: {
    totalInvalidRecords,
    recordsInserted,
    totalNumberOfRecords,
    invalidRecordIds,
    shouldKeepAllRecords,
  },
}: SetUploadMetricsArguments) => {
  const updatesSucceededText = `${recordsInserted < 1
    ? 'There was an error saving the data to the test database. '
    : ''
    }${recordsInserted} out of ${totalNumberOfRecords} records were saved to the test database`;
  const recordsWereSavedText = shouldKeepAllRecords
    ? '. You have selected to include these records and they have been saved to the test database.'
    : 'and were not saved to the test database';
  let updatesFailedText =
    totalInvalidRecords > 0
      ? `${totalInvalidRecords} records contain malformed or incorrect data${recordsWereSavedText}.`
      : null;

  //  just show the first 50 service numbers if there are more than 50 with errors
  const serviceNumbersLimit = 50;
  const first50ServiceNumbers = invalidRecordIds?.slice(0, serviceNumbersLimit);

  const invalidIDsString =
    totalInvalidRecords > 0
      ? first50ServiceNumbers.reduce((curr, acc, index) => {
        return `${acc}, ${curr}${invalidRecordIds?.length > serviceNumbersLimit &&
          index === first50ServiceNumbers.length - 1
          ? `, ...`
          : ''
          }`;
      })
      : null;

  session.dataUpdateInfo = {};
  const dataToAdd = {
    updatesSucceededText,
    updatesFailedText,
    invalidIDsString,
    totalInvalidRecords,
    recordsInserted,
  };

  session.dataUpdateInfo = { ...dataToAdd };
};

@Controller(ConfigService.appUrls.UPDATE_DATA)
export class UpdateDataController {
  constructor(
    protected readonly rollOfHonourService: RollOfHonourService,
    protected readonly updateService: UpdateService,
  ) { }
  @UseGuards(UploadGuard)
  @UseFilters(UnauthorizedUploaderFilter)
  @Throttle(2, 60)
  @Get()
  @Render(`${ConfigService.pathNames.UPDATE_DATA}/${ConfigService.INDEX}`)
  async updateData(
    @Req() req,
    @Res() res,
    @Session() session: ISession,
    @Locals() locals,
  ) {
    let inlineErrors = locals?.errorList?.[0] ?? [];
    const errors = locals?.errors?.[0];

    const pageTitle = `${errors?.length ? 'Error: ' : ''}Update data`;
    const [lastUpdatedDate] = await this.rollOfHonourService.getLastUpdatedDate() ?? [];
    const { updated_at } = lastUpdatedDate ?? {};
    const productionLastUpdatedAtText = `Production last updated at ${updated_at}`;

    const fileUploadOptions: FileUploadOptions = {
      inputType: ConfigService.inputTypes.UPLOAD,
      inputOptions: {
        id: ConfigService.UPDATE_DATA,
        name: ConfigService.UPDATE_DATA,
        label: {
          text: 'Upload a file',
        },
        hint: {
          text: `Select a CSV file to upload to the test database.`,
        },
        errorMessage: errors,
      },
    };

    const checkboxOptions: CheckboxOptions = {
      inputType: ConfigService.inputTypes.CHECKBOXES,
      inputOptions: {
        id: 'keep-all',
        name: 'keep-all',
        hint: {
          text: 'Save all records, including records that are found to have invalid data.',
        },
        items: [
          {
            value: 'yes',
            text: 'Save all records',
          },
        ],
      },
    };

    const formInputFields = [fileUploadOptions, checkboxOptions];

    return {
      pageTitle,
      errors,
      inline: inlineErrors,
      productionLastUpdatedAtText,
      formOptions: {
        isFileUpload: true,
        submitUrl: ConfigService.appUrls.UPDATE_DATA,
        formInputFields,
        submitButton: {
          text: 'Upload to test database',
          id: 'uploadButton',
        },
      },
    };
  }

  @UseGuards(UploadGuard)
  @UseFilters(UnauthorizedUploaderFilter, InvalidFileFilter)
  @Throttle(5, 30)
  @Post()
  @Csrf()
  @UseInterceptors(FileInterceptor(ConfigService.pathNames.UPDATE_DATA))
  async uploadUpdateData(
    @UploadedFile(
      new ParseFilePipe({
        exceptionFactory: (fileError) => {
          throw new BadRequestException({
            statusCode: 400,
            message: fileError,
          });
        },
        validators: [new ValidateFileIsImage()],
      }),
    )
    file: Express.Multer.File,

    @Req() req,
    @Res() res,
    @Session() session: ISession,
    @Body() body,
  ) {
    const shouldkeepAllRecords = !!body[ConfigService.KEEP_ALL];

    const { csvData, totalInvalidRecords, invalidRecordIds, allRecords } =
      await this.updateService.getDataFromCSV(file, shouldkeepAllRecords);
    try {
      const usersModMail = req.session.modmail;
      const notifyVerificationEmailId = req.session.notifyVerificationEmailId
      const dbInsertResponse = await this.rollOfHonourService.addRecordsBatch({
        recordsToInsert: allRecords,
        modMail: usersModMail,
        notifyVerificationEmailId
      });
      if (dbInsertResponse) {
        const { identifiers } = dbInsertResponse;
        const recordsSavedSucessfully = identifiers?.length;

        setUploadMetrics({
          session,
          dataUpdateInfo: {
            totalInvalidRecords,
            recordsInserted: recordsSavedSucessfully,
            totalNumberOfRecords: csvData.length,
            invalidRecordIds,
            shouldKeepAllRecords: shouldkeepAllRecords,
          },
        });
      }
      res.redirect(
        `/${ConfigService.pathNames.UPDATE_DATA}/${ConfigService.pathNames.CONFIRM_DATA}`,
      );
    } catch (err) {
      session.flash.errorList = [{
        text: `There was a problem updating the database`,
        href: '#update-data',
      }];
      res.redirect(`/${ConfigService.pathNames.UPDATE_DATA}`);
    }
  }

  @UseGuards(UploadGuard)
  @UseFilters(UnauthorizedUploaderFilter)
  @Get(ConfigService.pathNames.CONFIRM_DATA_TRANSFER)
  async confirmTransfer(@Res() res) {
    return res.redirect(ConfigService.appUrls.MODLOGIN);
  }

  @UseGuards(UploadGuard)
  @UseFilters(UnauthorizedUploaderFilter, UpdateDataBadRequestExceptionFilter)
  @Throttle(2, 30)
  @Post(ConfigService.pathNames.CONFIRM_DATA_TRANSFER)
  @Csrf()
  async transferToMainDB(
    @Req() req: IRequest,
    @Res() res,
    @Body() body: BaseDto,
    @Session() session: ISession,
  ) {
    const notifyVerificationEmailId = session.notifyVerificationEmailId


    try {
      await this.rollOfHonourService.transferToMainDB({
        updatedBy: notifyVerificationEmailId,
      });
      const { recordsInserted } = session?.dataUpdateInfo ?? {};
      session.dataUpdateInfo.updatesSucceededText = `${recordsInserted} records saved to the production database.`;
      res.redirect(
        `/${ConfigService.pathNames.UPDATE_DATA}/${ConfigService.pathNames.SUCCESS}`,
      );
    } catch (err) { }
  }

  @UseGuards(UploadGuard)
  @UseFilters(UnauthorizedUploaderFilter)
  @Get(ConfigService.pathNames.CONFIRM_DATA)
  @Render(
    `${ConfigService.pathNames.UPDATE_DATA}/${ConfigService.pathNames.CONFIRM_DATA}`,
  )
  async confirmData(@Req() req, @Res() res, @Session() session: ISession) {
    const dataUpdateInfo = session.dataUpdateInfo;

    return {
      dataUpdateInfo,
      formOptions: {
        isFileUpload: false,
        submitUrl: ConfigService.appUrls.CONFIRM_DATA_TRANSFER,
        submitButton: {
          text: 'Transfer to production',
          id: 'transfer',
        },
      },
    };
  }

  @UseGuards(UploadGuard)
  @UseFilters(UnauthorizedUploaderFilter)
  @Get(ConfigService.pathNames.SUCCESS)
  @Render(
    `${ConfigService.pathNames.UPDATE_DATA}/${ConfigService.pathNames.SUCCESS}`,
  )
  async successfullyUploaded(
    @Req() req,
    @Res() res,
    @Session() session: ISession,
  ) {
    const { updatesSucceededText } = session?.dataUpdateInfo ?? {};

    session.dataUpdateInfo = null;
    session.modmail = null;
    session.notifyVerificationEmailId = null;

    return {
      updatesSucceededText,
      hideBackLink: true,
    };
  }
}
