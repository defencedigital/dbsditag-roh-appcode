import { Response as ExpressResponse } from 'express';

declare module 'express-serve-static-core' {
  export interface Response extends ExpressResponse {
    locals: any;
  }
}