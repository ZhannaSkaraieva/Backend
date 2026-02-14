import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.use(helmet());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

//Helmet — это middleware для NestJS (и Express), которое защищает сервер через HTTP-заголовки.

//CORS: Этот пакет устанавливает заголовки ответа — он не блокирует запросы. Соблюдение CORS обеспечивается браузерами: они проверяют заголовки и решают, может ли JavaScript прочитать ответ. Клиенты, не использующие браузеры (curl, Postman и другие серверы), полностью игнорируют CORS.
