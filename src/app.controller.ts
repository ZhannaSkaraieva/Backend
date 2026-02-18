import { Body, Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
//import { EventService } from './event/event.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    //private readonly eventService: EventService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // @Post('events')
  // triggerEvent(@Body() body: { type: string; data: any }) {
  //   return this.eventService.handleIncomingEvent(body.type, body.data);
  // }
}
