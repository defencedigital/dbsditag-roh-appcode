import {
  Controller,
  Get,
  Session,
  Res,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { ConfigService } from '../../services';
import { RollOfHonourService } from '../../roll_of_honour/roll_of_honour.service';
import { ResultsService } from './results.service';
import { ISession } from 'src/types/types';

@Controller(ConfigService.pathNames.RESULT)
export class ResultsController {
  constructor(
    private readonly rollOfHonourService: RollOfHonourService,
    private readonly resultService: ResultsService,
  ) {}
  @Get()
  async index(
    @Session() session: ISession,
    @Res() res,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(25), ParseIntPipe) limit: number = 25,
  ) {
    const sessionFormAnswers = session.sessionFormAnswers ?? {};

    if (!sessionFormAnswers.service) {
      return res.redirect(ConfigService.appUrls.SERVICE);
    }
    if (!sessionFormAnswers.surname && !sessionFormAnswers.service_number) {
      return res.redirect(ConfigService.pathNames.DETAILS);
    }

    let result = await this.rollOfHonourService.search({
      page,
      limit,
      route: `/${ConfigService.pathNames.RESULT}`,
      service: sessionFormAnswers.service,
      surname: sessionFormAnswers.surname,
      forenames: sessionFormAnswers.firstname,
      service_number: sessionFormAnswers.service_number ?? '',
    });

    const formattedResult = this.resultService.formatSearchResult(result, page);

    return res.render(
      `${ConfigService.pathNames.RESULT}/${ConfigService.INDEX}`,
      { pageName: 'Results', ...formattedResult },
    );
  }
}
