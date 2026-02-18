// import { Injectable } from '@nestjs/common';
// type EventConfig = {
//   templateId: string;
//   subject: string;
//   toField: string;
// };
// @Injectable()
// export class EventMapper {
//   private events: Record<string, EventConfig> = {
//     'user.registered': {
//       templateId: 'd-xxxxxxxxxxxx',
//       subject: 'Welcome to My App!',
//       toField: 'email',
//     },
//     'payment.success': {
//       templateId: 'd-yyyyyyyyyyyy',
//       subject: 'Your Payment Was Successful',
//       toField: 'email',
//     },
//   };
//   get(eventType: string): EventConfig | null {
//     return this.events[eventType] || null;
//   }
// }
