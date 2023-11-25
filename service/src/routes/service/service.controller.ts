import { Controller, Get, Render, Session } from '@nestjs/common';
import { BaseController } from '../base.controller';
import { Locals } from '../../decorators/locals.decorator';
import { ConfigService } from '../../services';
import { ISession } from 'src/types/types';

@Controller(ConfigService.appUrls.SERVICE)
export class ServiceController extends BaseController {
  @Get()
  @Render(`${ConfigService.SERVICE}/${ConfigService.INDEX}`)
  index(@Session() session: ISession, @Locals() locals) {
    const errors = locals?.errors;
    const fieldId = ConfigService.formKeys.SERVICE;
    const pageTitle = `Search the Roll of Honour`;
    const form = session.sessionFormAnswers;

    const checkboxesElement = {
      inputType: ConfigService.inputTypes.CHECKBOXES,
      inputOptions: {
        idPrefix: fieldId,
        name: `${fieldId}[]`,
        fieldset: {
          legend: {
            html: `<h2 class="govuk-heading-m" > Serviceperson's service</h2>`,
            isPageHeading: false,
          },
        },
        hint: { text: 'Check all services that apply.' },
        items: ConfigService.OPTIONS_SERVICE_BRANCHES,
        values: form?.service,
        errorMessage: errors?.service,
      },
    };

    return {
      pageName: pageTitle,
      pageTitle: pageTitle,
      formOptions: {
        formInputFields: [checkboxesElement],
      },
    };
  }
}
