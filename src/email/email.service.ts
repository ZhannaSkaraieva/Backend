//отправкf транзакционных писем с помощью Twilio SendGrid

import { Injectable } from '@nestjs/common'; //Предоставляет инструмент для создания декоративных элементов, используемый для оформления услуг.
//import * as sgMail from '@sendgrid/mail'; //Это официальный SDK для Node.js, предназначенный для взаимодействия с Twilio SendGrid.
import { ConfigService } from '@nestjs/config'; //Чтобы прочитать значения в вашем файле .env.
//import { OnEvent } from '@nestjs/event-emitter'; //Декоратор для подписки на события, генерируемые EventEmitter2. Он позволяет методам класса реагировать на определенные события, что упрощает реализацию реактивного программирования в приложении.
import sgMail from '@sendgrid/mail';

@Injectable()
export class EmailService {
  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('SENDGRID_API_KEY');
    if (!apiKey) {
      throw new Error('SENDGRID_API_KEY is not defined');
    }
    sgMail.setApiKey(apiKey); //SDK SendGrid инициализируется этим ключом, чтобы он мог отправлять электронные письма от имени сервиса.
  }

  async sendVerificationEmail(email: string, verificationToken: string) {
    console.log('sendVerificationEmail called');
    console.log('Email:', email);
    console.log('Token:', verificationToken);
    const from = this.configService.get<string>('SENDGRID_SENDER_EMAIL');
    if (!from) {
      throw new Error(
        'SENDGRID_SENDER_EMAIL is not defined in the configuration',
      );
    }
    const msg = {
      to: email,
      from,
      subject: 'Verify your email',
      html: `<p>Click <a href="http://localhost:3000/auth/verify-email?token=${verificationToken}">here</a> to verify your email.</p>`,
    };
    try {
      await sgMail.send(msg);
    } catch {
      throw new Error('Failed to send verification email');
    }
  }

  // @OnEvent('user.registered')
  // async handleUserRegistered(payload: any) {
  //   await this.sendEmail(
  //     payload.email,
  //     'Welcome to Our App!',
  //     'd-xxxxxxxxxxxx',
  //     { name: payload.name },
  //   );
  // }
  // sendEmail(email: any, arg1: string, arg2: string, arg3: { name: any }) {
  //   throw new Error('Method not implemented.');
  // }
  // @OnEvent('invoice.generated')
  // async handleInvoiceGeneratedEvent(payload: any) {
  //   await this.sendEmail(
  //     payload.email,
  //     'Your Invoice is Ready',
  //     'd-xxxxxxxxxxxx',
  //     { amount: payload.amount },
  //   );
  // }
}
