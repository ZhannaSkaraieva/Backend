// //генерации и прослушивания пользовательских событий приложения
// import { Injectable } from '@nestjs/common';
// import { EventEmitter2 } from '@nestjs/event-emitter';
// import { EventMapper } from './event-mapper';
// @Injectable()
// export class EventService {
//   constructor(
//     private eventEmitter: EventEmitter2,
//     private eventMapper: EventMapper,
//   ) {}

//   handleIncomingEvent(type: string, data: any) {
//     const config = this.eventMapper.get(type);
//     if (!config) {
//       throw new Error(`Unhandled event type: ${type}`);
//     }
//     this.eventEmitter.emit(type, data);
//   }
// }
