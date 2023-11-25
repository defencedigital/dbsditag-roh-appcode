import { Controller, Get, Res } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';

@Controller()
export class AppController {
  @Throttle(5, 60)
  @Get()
  index(@Res() res) {
    return res.redirect('/service');
  }
}
