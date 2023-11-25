import { Provider } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { ConfigService } from 'src/services';

export const SessionProvider: Provider = {
  provide: ConfigService.SESSION,
  useFactory: (req: Request) => req.session,
  inject: [REQUEST],
};
