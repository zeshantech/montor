// backend/src/main.ts
import 'newrelic';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { RolesGuard } from './auth/roles.guard';
import { Logger } from '@nestjs/common';
import { LoggingMiddleware } from './middleware/logging.middleware';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  const reflector = app.get(Reflector);
  app.useGlobalGuards(new RolesGuard(reflector));

  const config = new DocumentBuilder().setTitle('Cicd Monitorer Server').setVersion('1.0').build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
  Logger.log('Backend is running on http://localhost:3000', 'Bootstrap');
}
bootstrap();
