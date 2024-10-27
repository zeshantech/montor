// backend/src/main.ts
// import 'newrelic';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  // const reflector = app.get(Reflector);

  const config = new DocumentBuilder()
    .setTitle('Cicd Monitorer Server')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(5000);
  Logger.log('Backend is running on http://localhost:5000', 'Bootstrap');
}
bootstrap();
