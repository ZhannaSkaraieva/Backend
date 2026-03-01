//отправкf транзакционных писем с помощью Twilio SendGrid

import { Injectable } from '@nestjs/common'; //Предоставляет инструмент для создания декоративных элементов, используемый для оформления услуг.
//import * as sgMail from '@sendgrid/mail'; //Это официальный SDK для Node.js, предназначенный для взаимодействия с Twilio SendGrid.
import { ConfigService } from '@nestjs/config'; //Чтобы прочитать значения в вашем файле .env.
import sgMail from '@sendgrid/mail';
import { EmailProviderInterface } from '../interfaces/email.interface';

@Injectable()
export class SendGridService implements EmailProviderInterface {
  private readonly templates: Record<string, string> = {
    'verify-email': 'd-8fe8c5b38cce4d0e9cd3338565e4edf7',
    'reset-password': 'd-c140abc61f854bef8542ecbe5ad6a3f4',
  };
  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('SENDGRID_API_KEY');
    if (!apiKey) {
      throw new Error('SENDGRID_API_KEY is not defined');
    }
    sgMail.setApiKey(apiKey); //SDK SendGrid инициализируется этим ключом, чтобы он мог отправлять электронные письма от имени сервиса.
  }

  //НАСТРОЙКА МЕТОДА ДЛЯ ОТПРАВКИ ПИСЕМ
  async sendEmail(
    to: string,
    subject: string,
    eventName: string,
    dynamicData: Record<string, unknown>,
  ) {
    const templateId = this.templates[eventName];

    if (!templateId) {
      throw new Error(
        `Template for event "${eventName}" is not defined in SendGrid`,
      );
    }
    const from = this.configService.get<string>('SENDGRID_SENDER_EMAIL');
    if (!from) {
      throw new Error('SENDGRID_SENDER_EMAIL is not defined');
    }
    const msg = {
      to,
      from,
      subject,
      templateId,
      dynamicTemplateData: dynamicData,
    };
    try {
      await sgMail.send(msg);
    } catch {
      throw new Error('Failed to send email');
    }
  }
}
