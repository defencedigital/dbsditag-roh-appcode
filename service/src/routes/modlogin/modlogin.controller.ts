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
import { AppService } from '../../app.service';
import { validate } from 'class-validator';
import { ModLoginService } from './modlogin.service';

@Controller('modlogin')
export class ModloginController {
  constructor(
    private readonly appService: AppService,
    private readonly loginService: ModLoginService,
  ) { }

  @Get()
  @Render('modlogin/index')
  index() {
    return {};
  }

  @Post()
  async save(@Body() data: any, @Res() res, @Session() session) {
    const { default: dtoModule } = require('./modlogin.dto');
    const dto = new dtoModule(data);
    const errors = await validate(dto);

    if (errors.length > 0) {
      const firstError = errors[0];
      const message = Object.values(firstError.constraints || {})[0];

      return res.render('modlogin/index', {
        error: message,
        values: data,
      });
    }

    session['tempmail'] = data.email;
    session['verifyToken'] = this.loginService.generateAccessCode();
    const notifyResponse = await this.loginService.sendVerificationEmail(
      data.email,
      session['verifyToken'],
    );

    const notifyVerificationEmailId = notifyResponse?.data?.id
    session.notifyVerificationEmailId = notifyVerificationEmailId



    return res.redirect('/modlogin/verify');
  }

  @Get('/verify')
  @Render('modlogin/verify')
  verify(@Session() session) {
    return {}
  }

  @Post('/verify')
  verifyToken(@Body() data: any, @Res() res, @Session() session) {
    if (data.verifyToken === session['verifyToken']) {
      session['modmail'] = session['tempmail'];
      session['tempmail'] = null;
      session['verifyToken'] = null;

      return res.redirect('/update-data');
    }

    return res.render('modlogin/verify', {
      error: 'Invalid verification code',
    });
  }

  @Get('get-hostname')
  async getHostname(@Req() req): Promise<string[] | any> {
    const ip = req.headers['x-forwarded-for'] || req.ip;
    try {
      const hostnames = await this.appService.resolveHostname(ip);
      return hostnames;
    } catch (err) {
      // handle error appropriately
      throw err;
    }
  }
}
