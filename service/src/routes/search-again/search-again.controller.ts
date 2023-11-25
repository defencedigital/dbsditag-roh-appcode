import { Controller, Get, Req, Res } from '@nestjs/common';
import { ConfigService } from 'src/services';
import { IRequest } from 'src/types/types';

@Controller()
export class SearchAgainController {
  @Get(ConfigService.appUrls.SEARCH_AGAIN)
  searchAgain(@Req() req: IRequest, @Res() res) {
    try {
      req.session = null;
      res.redirect(ConfigService.appUrls.SERVICE);
    } catch (err) {}
  }
}
