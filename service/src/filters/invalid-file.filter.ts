import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  BadRequestException
} from '@nestjs/common';
import { Response } from 'express';
import { ConfigService } from 'src/services/config.service';
import { IRequest } from 'src/types/types';

@Catch(BadRequestException)
export class InvalidFileFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const req = ctx.getRequest<IRequest>();
    const errorMessage = exception.message;
    const currentFlash = req.session.flash ?? {}
    req.session.flash = {
      ...currentFlash,
      errorList: [
        {
          text: errorMessage,
          href: `#${ConfigService.pathNames.UPDATE_DATA}`,
        }
      ],
      errors: [{

        text: errorMessage,
        id: ConfigService.UPDATE_DATA
      }
      ]
    }

    response.redirect(ConfigService.appUrls.UPDATE_DATA);
  }
}
