import { ConfigService } from '@nestjs/config';
import { SendGridService } from './providers/sendgrid.service';
import { EmailProviderInterface } from './interfaces/email.interface';

export class EmailFactory {
  static createEmailProvider(
    provider: string,
    config: ConfigService,
  ): EmailProviderInterface {
    // Мы обещаем, что вернем объект, у которого ТОЧНО есть метод sendEmail
    switch (provider) {
      case 'sendgrid':
        return new SendGridService(config);
      default:
        throw new Error(`Unsupported email provider: ${provider}`);
    }
  }
}
