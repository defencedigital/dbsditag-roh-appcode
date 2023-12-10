import {Injectable} from '@nestjs/common';
import {NotifyClient} from 'notifications-node-client';
import {ConfigService} from "../../services";

@Injectable()
export class ModLoginService {

    private readonly config: ConfigService;

    constructor() {
        this.config = new ConfigService();
    }

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
        const notifyClient = new NotifyClient(this.config.get('NOTIFY_API_KEY'));
        const template = this.config.get('MODLOGIN_TEMPLATE');

        try {
            return await notifyClient.sendEmail(template, email, {
                personalisation: {
                    verifyToken: verifyToken,
                },
            });
        } catch (err) {
        }
    }
}
