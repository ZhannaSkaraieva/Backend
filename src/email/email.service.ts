//отправкf транзакционных писем с помощью Twilio SendGrid

import { Injectable } from '@nestjs/common'; //Предоставляет инструмент для создания декоративных элементов, используемый для оформления услуг.
import { ConfigService } from '@nestjs/config';
import { EmailFactory } from './email.factory';
//import * as sgMail from '@sendgrid/mail'; //Это официальный SDK для Node.js, предназначенный для взаимодействия с Twilio SendGrid.

@Injectable()
export class EmailService {
  constructor(private configService: ConfigService) {}

  //НАСТРОЙКА МЕТОДА ДЛЯ ОТПРАВКИ ПИСЕМ
  async send(
    provider: string,
    to: string,
    subject: string,
    eventName: string,
    dynamicData: Record<string, unknown>,
  ) {
    // ПОЛУЧАЕМ ПРОВАЙДЕРА ЧЕРЕЗ ФАБРИКУ
    const mailer = EmailFactory.createEmailProvider(
      provider,
      this.configService,
    );

    // Просто вызываем метод. Нам не важно, кто это (SendGrid или другой)
    await mailer.sendEmail(to, subject, eventName, dynamicData);
  }
}
