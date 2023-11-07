import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  ForbiddenException,
} from '@nestjs/common';
import { Response } from 'express';
import { ConfigService } from 'src/services/config.service';

@Catch(ForbiddenException)
export class UnauthorizedUploaderFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.redirect(ConfigService.appUrls.MODLOGIN);
  }
}
