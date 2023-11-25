import { Injectable } from '@nestjs/common';
import { NotifyClient } from 'notifications-node-client';

@Injectable()
export class ModLoginService {
  /** Generate a 6 character random string not using Crypto */
  generateAccessCode(length: number = 6): string {
    const chars = 'ABCDEFGHIJKLMNPRSTUVWXYZ123456789';
    let result = '';
    let current = Date.now();

    for (let i = 0; i < length ?? 6; i++) {
      result += chars.charAt(current % chars.length);
      current = Math.floor(current / chars.length);
    }

    return result;
  }

  async sendVerificationEmail(email: string, verifyToken: string) {
    const notifyClient = new NotifyClient(process.env.NOTIFY_API_KEY);
    const template = process.env.MODLOGIN_TEMPLATE;

    try {
      return await notifyClient.sendEmail(template, email, {
        personalisation: {
          verifyToken: verifyToken,
        },
      });
    } catch (err) { }
  }
}
