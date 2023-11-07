import { Controller, Get, Post, Render, Req, Res } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { Throttle } from '@nestjs/throttler';
import { Csrf } from 'ncsrf';
import { ConfigService } from 'src/services';
import { IRequest } from 'src/types/types';

@Controller(`${ConfigService.pathNames.FEEDBACK}`)
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Get()
  @Render(`${ConfigService.pathNames.FEEDBACK}/${ConfigService.INDEX}`)
  index() {
    return {};
  }

  @Post()
  @Throttle(5, 60)
  @Csrf()
  send(@Req() req: IRequest, @Res() res) {
    const bodyParams = req.body;
    this.feedbackService.send({
      satisfaction: bodyParams.satisfaction,
      feedback: bodyParams.feedback,
      name: bodyParams.name,
      email: bodyParams.email,
    });
    return res.redirect(`${ConfigService.appUrls.FEEDBACK_SENT}`);
  }

  @Get(`/${ConfigService.pathNames.SENT}`)
  @Render(`${ConfigService.pathNames.FEEDBACK}/${ConfigService.pathNames.SENT}`)
  sent() {
    return {};
  }
}
