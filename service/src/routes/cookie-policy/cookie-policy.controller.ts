import {
  Body,
  Controller,
  Get,
  Post,
  Render,
  Req,
  Res,
  Session,
} from '@nestjs/common';
import { ConfigService } from 'src/services';
import { IRequest, ISession } from 'src/types/types';
import { CookiePolicyService } from './cookie-policy.service';

@Controller(ConfigService.pathNames.COOKIE_POLICY)
export class CookiePolicyController {
  constructor(private readonly cookiePolicyService: CookiePolicyService) {}

  @Get()
  @Render(`${ConfigService.pathNames.COOKIE_POLICY}/${ConfigService.INDEX}`)
  async index(@Req() req, @Res() res, @Session() session: ISession) {
    const cookies = req.cookies;
    const cookiePreferences =
      this.cookiePolicyService.getCookiePreferences(cookies);

    res.cookie(
      ConfigService.COOKIE_PREFENCES,
      JSON.stringify(cookiePreferences),
    );

    const showNotification = session.showNotification || false;
    delete session.showNotification;

    return this.cookiePolicyService.formatResponse({
      cookiePreferences,
      showNotification,
    });
  }

  @Post()
  async save(
    @Req() req: IRequest,
    @Res() res,
    @Body() body,
    @Session() session,
  ) {
    const backURL = req.header('Referer') || '/';
    const cookies = req.cookies;

    const cookiePreferences =
      this.cookiePolicyService.getCookiePreferences(cookies);
    const analyticsAnswer = body['cookie-usage-preference'] === 'use';

    const updatedCookiePreferences =
      this.cookiePolicyService.updateCookiePreferences({
        cookiePreferences,
        setAnalytics: analyticsAnswer,
      });

    res.cookie(
      ConfigService.COOKIE_PREFENCES,
      JSON.stringify(updatedCookiePreferences),
    );
    res.redirect(backURL);
  }
}
