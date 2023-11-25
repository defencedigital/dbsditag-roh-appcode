import { Injectable } from '@nestjs/common';
import { NotifyClient } from 'notifications-node-client';

@Injectable()
export class FeedbackService {
  send({ satisfaction, feedback, name, email }) {
    let notifyClient = new NotifyClient(process.env.GOV_NOTIFY_API_KEY);
    let templateId = process.env.FEEDBACK_TEMPLATE_ID;

    let personalisation = {
      service: satisfaction || 'Not provided',
      feedback: feedback || 'No feedback provided',
      name: name || 'No feedback provided',
      email: email || 'No feedback provided',
    };

    notifyClient
      .sendEmail(templateId, process.env.GOV_NOTIFY_EMAIL, {
        personalisation: personalisation,
      })
      .then((response) => {})
      .catch((err) => console.error(err, err.response, err.response.data));
  }
}
