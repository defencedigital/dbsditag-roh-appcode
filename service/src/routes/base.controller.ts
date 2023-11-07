import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Csrf } from 'ncsrf';
import { AppService } from '../app.service';
import { ApplicationService, ConfigService } from '../services/';
import { Reflector } from '@nestjs/core';
import { plainToInstance } from 'class-transformer';

@Controller()
export class BaseController {
  protected section: number;
  protected basePath: string;
  protected baseName: string;
  protected dtoName: string;
  protected dtoKebab: string;

  constructor(
    protected readonly appService: AppService,
    protected readonly config: ConfigService,
    protected readonly application: ApplicationService,
  ) {
    const childClass = Object.getPrototypeOf(this).constructor;
    const reflector = new Reflector();
    this.basePath = reflector.get<string>('path', childClass);
    this.baseName = childClass.name.replace('Controller', '');
    this.dtoName = this.baseName + 'DTO';
    this.dtoKebab = this.baseName
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .toLowerCase();

    this.config.getSectionFromPath(this.basePath);
  }

  @Get()
  index(@Req() req, @Res() res) {
    return {};
  }

  @Post()
  @Csrf()
  @UsePipes(new ValidationPipe({ transform: true }))
  async save(@Body() data: any, @Req() req, @Res() res) {
    const { default: dtoModule } = await import(
      '../dto/' + this.dtoKebab + '.dto'
    );

    const dtoEntityClass = plainToInstance(dtoModule, data);

    try {
      const isValidReqBody = await this.appService.validateResponse(
        dtoEntityClass,
        req,
      );

      if (!isValidReqBody) {
        return res.redirect(this.basePath);
      }
    } catch (err) {}

    const nextPath = this.application
      .markSectionComplete(this.config.getSectionFromPath(this.basePath))
      .nextSection(this.basePath);
    return res.redirect(nextPath);
  }
}
