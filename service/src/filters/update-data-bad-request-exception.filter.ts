import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { ConfigService } from 'src/services/config.service';

@Catch(BadRequestException)
export class UpdateDataBadRequestExceptionFilter<T> implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const errorMessage = exception.message;

    response.locals.errors = {
      text: errorMessage,
      href: `#${ConfigService.pathNames.UPDATE_DATA}`,
    }
    response.redirect('/update-data');
  }
}
