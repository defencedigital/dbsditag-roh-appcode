import {
  Controller,
  Get,
  Render,
  Res,
  Param,
  ParseUUIDPipe,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '../../services';
import { RollOfHonourService } from '../../roll_of_honour/roll_of_honour.service';
import { Throttle } from '@nestjs/throttler';
import { ServicepersonService } from './serviceperson.service';
import { Response } from 'express';

@Controller()
export class ServicepersonController {
  constructor(
    private readonly rollOfHonourService: RollOfHonourService,
    private readonly servicepersonService: ServicepersonService,
  ) {}

  @Throttle(5, 60)
  @Get(`/${ConfigService.SERVICEPERSON}/:${ConfigService.ID}`)
  @Render(`${ConfigService.SERVICEPERSON}/${ConfigService.INDEX}`)
  async serviceperson(@Param(ConfigService.ID, ParseUUIDPipe) id: string) {
    const result = await this.rollOfHonourService.get(id);

    if (!result) throw new NotFoundException('Serviceperson not found');

    const summary = this.servicepersonService.getServicepersonSummary(result);

    return {
      serviceperson: summary,
      id: id,
    };
  }

  @Throttle(5, 60)
  @Get(`/${ConfigService.SERVICEPERSON}/:${ConfigService.ID}/pdf`)
  async download(
    @Param(ConfigService.ID, ParseUUIDPipe) id,
    @Res() res: Response,
  ) {
    const result = await this.rollOfHonourService.get(id);
    if (!result) throw new NotFoundException('Serviceperson not found');

    this.servicepersonService.generatePdf(result, res);
  }
}
