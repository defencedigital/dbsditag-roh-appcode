import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as nunjucks from 'nunjucks';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv';
import { join } from 'path';
import { nestCsrf } from 'ncsrf';
import helmet from 'helmet';
import * as crypto from 'crypto';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import {ConfigService} from "./services";
import {env} from "node:process";
dotenv.config();



async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const express = app.getHttpAdapter().getInstance();
  const configService = app.get(ConfigService);

  const assets = join(__dirname, '..', 'public');
  const views = join(__dirname, '..', 'views');
  const cookieSession = require('cookie-session');

  nunjucks.configure(
    [join(__dirname, '..', 'node_modules', 'govuk-frontend'), views],
    { express },
  );

  app.useStaticAssets(assets);
  app.setBaseViewsDir(views);
  app.setViewEngine('njk');

  app.use([
    cookieSession({
      name: 'session',
      keys: [crypto.randomBytes(32).toString('hex')],
      maxAge: 0,
      secure: true,
        httpOnly: true,
      sameSite: 'strict',
    }),
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: [
            "'self'",
            'www.googletagmanager.com',
            'https://www.googletagmanager.com',
          ],
          scriptSrc: [
            "'self'",
            "'unsafe-inline'",
            'www.googletagmanager.com',
            'https://www.googletagmanager.com',
          ],
          styleSrc: [
            "'self'",
            "'unsafe-inline'",
            'www.googletagmanager.com',
            'https://www.googletagmanager.com',
          ],
          imgSrc: [
            "'self'",
            'https://www.google-analytics.com',
            'https://region1.google-analytics.com',
          ],
          connectSrc: [
            "'self'",
            'https://www.google-analytics.com',
            'https://region1.google-analytics.com',
          ],
        },
      },
    }),
  ]);
  app.use(cookieParser());
  app.useGlobalFilters(new HttpExceptionFilter());

  app.use((req, res, next) => {
    res.locals.nonce = Buffer.from(crypto.randomBytes(16)).toString('base64');
    next();
  });

  app.set('trust proxy', true);
  app.use(
    nestCsrf({
      ttl: 6000
    }),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  app.setLocal(
    'serviceName',
    'Search the Armed Forces Memorial Roll of Honour',
  );
  app.setLocal('saveButtonLabel', 'Continue');

  await app.listen(process.env.PORT || 1337);
}

bootstrap();
