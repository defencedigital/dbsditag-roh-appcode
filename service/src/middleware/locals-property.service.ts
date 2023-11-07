import { Injectable, NestMiddleware } from '@nestjs/common';
import { ApplicationService, ConfigService } from '../services';
import { IRequest } from 'src/types/types';

@Injectable()
export class LocalsPropertyMiddleware implements NestMiddleware {
  constructor(
    private readonly application: ApplicationService,
    private readonly config: ConfigService,
  ) { }

  use(req: IRequest, res: any, next: () => void) {
    let showCookie = true;
    const hideBackLink = req.originalUrl === '/';

    try {
      if (req.hasOwnProperty('cookies')) {
        showCookie = req.cookies.hasOwnProperty(ConfigService.COOKIE_PREFENCES)
          ? !JSON.parse(req.cookies.cookie_preferences).seen
          : true;
      }
    } catch (error) {
      showCookie = true;
    }

    res.locals = {
      ...res.locals,
      showCookieBanner: showCookie,
      hideBackLink: hideBackLink,
      session: req.session,
      sessionFormAnswers: req.session?.sessionFormAnswers,
    };

    if (req.method === 'GET') {
      res.locals.csrfToken = req.csrfToken?.();
    }

    if (req.session?.flash?.oldSessionFormData) {
      const flashOld: Record<string, string> =
        req.session?.flash?.oldSessionFormData;

      for (const property in flashOld) {
        if (property !== '_csrf')
          res.locals['sessionFormAnswers'][property] =
            flashOld[property] ?? null;
      }
      delete req.session?.flash?.oldSessionFormData;
    }

    if (req.session?.flash?.errors) {
      res.locals.errors = req.session?.flash?.errors;

      delete req.session?.flash?.errors;
    }

    if (req.session?.flash?.errorList) {
      res.locals.errorList = req.session?.flash?.errorList;
      delete req.session?.flash?.errorList;
    }


    next();
  }
}
