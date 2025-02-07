import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { createDocument } from './swagger/swagger';
import * as cookieParser from 'cookie-parser';
import { HttpExceptionFilter } from './error-handeling/http.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe())
  app.use(cookieParser());
  // app.useGlobalFilters(new HttpExceptionFilter())
  SwaggerModule.setup('covid-data', app, createDocument(app));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

