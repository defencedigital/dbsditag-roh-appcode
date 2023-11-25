import { Injectable } from '@nestjs/common';
import { validate } from 'class-validator';
import { ApplicationService } from './services/application.service';
import { IRequest } from './types/types';
import * as dns from 'dns';

@Injectable()
export class AppService {
  constructor(private applicationService: ApplicationService) { }
  resolveHostname(ip: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
      dns.reverse(ip, (err, hostnames) => {
        if (err) {
          return reject(err);
        }
        resolve(hostnames);
      });
    });
  }

  getCookiePreferences(req: IRequest) {
    if (req.cookies.cookie_preferences) {
      return req.cookies.cookie_preferences;
    }
    return null;
  }

  async validateResponse(data: object, req): Promise<boolean> {
    try {
      const errors = await validate(data);

      if (errors.length > 0) {
        req.session['flash'] = {};
        req.session['flash']['errors'] = errors.reduce(
          (acc, { property, constraints }) => {
            acc[property] = {
              text: constraints[Object.keys(constraints)[0]],
              id: property,
            };
            return acc;
          },
          {},
        );

        req.session['flash']['errorList'] = errors.map(
          ({ property, constraints }) => {
            return {
              text: constraints[Object.keys(constraints)[0]],
              href: `#${property}`,
            };
          },
        );

        req.session['flash']['oldSessionFormData'] = req.body;
        delete req.session['flash']['oldSessionFormData']['_csrf'];
        return false;
      }

      if (!req.session['sessionFormAnswers']) {
        req.session['sessionFormAnswers'] = {};
      }

      for (const key of Object.keys(data)) {
        if (!key.startsWith('_')) {
          req.session['sessionFormAnswers'][key] = data[key];
        }
      }
      return true;
    } catch (err) { }
  }
}
