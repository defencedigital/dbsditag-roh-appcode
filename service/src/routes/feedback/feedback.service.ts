import { Injectable } from '@nestjs/common';
import { NotifyClient } from 'notifications-node-client';
import {ConfigService} from "../../services";

@Injectable()
export class FeedbackService {
  private readonly config: ConfigService;

    constructor() {
        this.config = new ConfigService();
    }

  send({ satisfaction, feedback, name, email }) {
    let notifyClient = new NotifyClient(this.config.get('GOV_NOTIFY_API_KEY'));
    let templateId = this.config.get('FEEDBACK_TEMPLATE_ID');

    let personalisation = {
      service: satisfaction || 'Not provided',
      feedback: feedback || 'No feedback provided',
      name: name || 'No feedback provided',
      email: email || 'No feedback provided',
    };

    notifyClient
      .sendEmail(templateId, this.config.get('GOV_NOTIFY_EMAIL'), {
        personalisation: personalisation,
      })
      .then((response) => {})
      .catch((err) => console.error(err, err.response, err.response.data));
  }
}
