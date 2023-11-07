import { Injectable } from '@nestjs/common';
import { IRequest, CookiePreferences } from 'src/types/types';

@Injectable()
export class CookiePolicyService {
  getCookiePreferences(cookies: IRequest['cookies']): CookiePreferences {
    const cookiePreferences: CookiePreferences = JSON.parse(
      cookies.cookie_preferences ??
        '{"analytics": false, "seen": false, "essential": true}',
    );
    cookiePreferences.seen = true;
    return cookiePreferences;
  }

  formatResponse({
    cookiePreferences,
    showNotification = false,
  }: {
    cookiePreferences: CookiePreferences;
    showNotification?: boolean;
  }) {
    return {
      pageName: 'Cookie Policy',
      cookieUsagePreference: cookiePreferences.analytics ? 'use' : 'dont-use',
      showNotification: showNotification ?? false,

      showCookieBanner: false,
      usage: [
        {
          name: '_ga',
          purpose: 'Used to distinguish users',
          expires: '2 years',
        },
        {
          name: '_ga_YEF99LLDKP',
          purpose: 'Used to distinguish users',
          expires: '2 years',
        },
      ],
      essential: [
        {
          name: 'csrftoken',
          purpose:
            'A standard cookie used to prevent a malicious exploit of a website',
          expires: '2 hours',
        },
        {
          name: 'connect.sid',
          purpose: 'Holds session data to complete the application',
          expires: 'When you close your browser',
        },
        {
          name: 'cookies_preference',
          purpose: 'Registers the input cookie preference',
          expires: 'When you close your browser',
        },
      ],
      settings: [],
      campaigns: [],
    };
  }

  updateCookiePreferences({
    cookiePreferences,
    setAnalytics = false,
  }: {
    cookiePreferences: CookiePreferences;
    setAnalytics?: boolean;
  }) {
    cookiePreferences.analytics = setAnalytics;
    cookiePreferences.seen = true;
    return cookiePreferences;
  }
}
