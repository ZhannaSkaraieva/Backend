import { Injectable } from '@nestjs/common';
type EventConfig = {
  templateId: string;
  subject: string;
  toField: string;
};
@Injectable()
export class EventMapper {
  private events: Record<string, EventConfig> = {
    'user.email.verified': {
      templateId: 'd-c140abc61f854bef8542ecbe5ad6a3f4',
      subject: 'Welcome to My App!',
      toField: 'email', // использовать в качестве адреса электронной почты получателя
    },
    'password.reset.requested': {
      templateId: 'd-8fe8c5b38cce4d0e9cd3338565e4edf7',
      subject: 'Password Reset Requested',
      toField: 'email',
    },
  };
  get(eventType: string): EventConfig | null {
    return this.events[eventType] || null;
  }
}
