import { Injectable, NestMiddleware } from '@nestjs/common';
import { ApplicationService, ConfigService } from '../services';

@Injectable()
export class Pathway implements NestMiddleware {
  constructor(
    private readonly config: ConfigService,
    private readonly application: ApplicationService,
  ) {}

  use(req: any, res: any, next: () => void) {
    const baseUrl = req.baseUrl.replace(/\/$/, '') || '/';
    const application = this.application;

    if (req.baseUrl.match(/(css|js|img|fonts|favicon|images)/)) {
      return next();
    }

    if (baseUrl !== '/') {
      const currentSectionNumber = this.application.getIntFromText(baseUrl);
      const lastIncompleteSection = application.firstIncompleteSection();
      const lastIncompleteSectionNumber = this.application.getIntFromText(
        lastIncompleteSection,
      );

      if (
        lastIncompleteSectionNumber > -1 &&
        currentSectionNumber > -1 &&
        currentSectionNumber > lastIncompleteSectionNumber
      ) {
        return res.redirect(lastIncompleteSection);
      }
    }
    next();
  }
}
