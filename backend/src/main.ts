// backend/src/main.ts
import 'newrelic';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  const reflector = app.get(Reflector);

  const config = new DocumentBuilder().setTitle('Cicd Monitorer Server').setVersion('1.0').build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
  Logger.log('Backend is running on http://localhost:3000', 'Bootstrap');
}
bootstrap();


// primary
// - modify that function and all over service that can be break
// - check my frontend using api and create api if backend have not that api (create missing apis)
// - use latest docs for anykind of 3rd party api
// - remove role base authentication
// - focus on core functionality instead of server performance monitoring
// - review jenkins and docker apis and services
// - try to use unused / remove code in each service
// - add rate limiting, prefer to use nestjs libraries like mailing, newrelic and that kind of all
// - modify all over backend code

// secondary
// - use clerk for authentication
// - establish new things to enhance functionality for my project
// - handle github more webhooks if we can handle

// -----check and do everything one by one------


// # DATABASE_HOST=mysql-17c8a557-zeshanshakil0-6333.a.aivencloud.com
// # DATABASE_PORT=24445
// # DATABASE_USERNAME=avnadmin
// # DATABASE_PASSWORD=AVNS_aH5u8UDPDQr9qRTXwFD
// # DATABASE_NAME=defaultdb
// HOST_URL=http://localhost:3000
// DATABASE_URI=postgresql://postgres.uzgcahqdymafprzeexkv:7qiZ3Q@Ve82TC*q@aws-0-eu-central-1.pooler.supabase.com:6543/postgres

// GITHUB_TOKEN=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

// DOCKER_HOST=docker-host
// DOCKER_CERT_PATH=DOCKER_CERT_PATH
// DOCKER_KEY_PATH=DOCKER_KEY_PATH
// DOCKER_CA_PATH=DOCKER_CA_PATH


// JENKINS_URL=JENKINS_URL
// JENKINS_USER=JENKINS_USER
// JENKINS_TOKEN=JENKINS_TOKEN


// EMAIL_HOST=EMAIL_HOST
// EMAIL_PORT=EMAIL_PORT
// EMAIL_USER=EMAIL_USER
// EMAIL_PASS=EMAIL_PASS

// NEW_RELIC_LICENSE_KEY=8655b3e7490c28a159963103fb3bab96FFFFNRAL

// CLERK_JWT_KEY=sk_test_4VlmYkdl4g0p13iCgnsoWDWLehVis0ntD2wyH0VRsu
// CLERK_PUBLISHABLE_KEY=pk_test_cHJpbWUtZm94LTY4LmNsZXJrLmFjY291bnRzLmRldiQ
// CLERK_SECRET_KEY=sk_test_4VlmYkdl4g0p13iCgnsoWDWLehVis0ntD2wyH0VRsu