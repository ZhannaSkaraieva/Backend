import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.use(helmet());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, //включить опцию белого списка, которая автоматически удаляет из запроса все свойства, не определенные явно в DTO.
      forbidNonWhitelisted: true,
      disableErrorMessages: true, // отключить объект сообщения об ошибке, чтобы не раскрывать детали валидации
    }),
  );
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

//Helmet — это middleware для NestJS (и Express), которое защищает сервер через HTTP-заголовки.

//CORS: Этот пакет устанавливает заголовки ответа — он не блокирует запросы. Соблюдение CORS обеспечивается браузерами: они проверяют заголовки и решают, может ли JavaScript прочитать ответ. Клиенты, не использующие браузеры (curl, Postman и другие серверы), полностью игнорируют CORS.
