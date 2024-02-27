import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as twilio from 'twilio';

@Injectable()
export class TwilioService {
  constructor(private config: ConfigService) {}

  private twilioAccountSid = this.config.get('TWILIO_ACCOUNT_SID');
  private twilioAuthToken = this.config.get('TWILIO_AUTH_TOKEN');
  private twilioNumber = this.config.get('TWILIO_PHONE_NUMBER');

  private client = twilio(this.twilioAccountSid, this.twilioAuthToken);

  async sendSMS(to: string, body: string) {
    // if (this.config.get('NODE_ENV') === 'production') {
    this.client.messages
      .create({
        to: `+2${to}`,
        body,
        from: this.twilioNumber,
      })
      .then((message) => console.log(message.sid));
    // }
  }
}
