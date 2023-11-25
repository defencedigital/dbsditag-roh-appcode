import { Controller, Get, Render, Session } from '@nestjs/common';
import { BaseController } from '../base.controller';
import { Locals } from '../../decorators/locals.decorator';
import { ConfigService } from '../../services';
import { ISession } from 'src/types/types';

@Controller(ConfigService.pathNames.DETAILS)
export class DetailsController extends BaseController {
  @Get()
  @Render(`${ConfigService.pathNames.DETAILS}/${ConfigService.INDEX}`)
  index(@Session() session: ISession, @Locals() locals) {
    const form = session.sessionFormAnswers;
    const errors = locals?.errors;

    const pageTitle = `Details of the serviceperson`;
    const firstNameInput = {
      inputType: ConfigService.inputTypes.INPUT,
      inputOptions: {
        id: ConfigService.formKeys.FIRST_NAME,
        name: ConfigService.formKeys.FIRST_NAME,
        value: form?.firstname,
        label: {
          text: 'First name(s) or initial(s) (optional)',
          isPageHeading: false,
        },
        errorMessage: errors?.firstname,
      },
    };

    const lastNameInput = {
      inputType: ConfigService.inputTypes.INPUT,
      inputOptions: {
        id: ConfigService.formKeys.SURNAME,
        name: ConfigService.formKeys.SURNAME,
        value: form?.surname ?? null,
        label: {
          text: 'Last name',
          isPageHeading: false,
        },
        errorMessage: errors?.surname,
      },
    };

    const serviceNumberInput = {
      inputType: ConfigService.inputTypes.INPUT,
      inputOptions: {
        id: ConfigService.formKeys.SERVICE_NUMBER,
        name: ConfigService.formKeys.SERVICE_NUMBER,
        value: form?.service_number,
        label: {
          text: 'Service number',
          isPageHeading: false,
        },
      },
    };

    return {
      pageName: pageTitle,
      pageTitle: pageTitle,
      formOptions: {
        formInputFields: [firstNameInput, lastNameInput, serviceNumberInput],
      },
    };
  }
}
