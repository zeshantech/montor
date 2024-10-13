// backend/src/app.module.ts

import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProjectsModule } from './projects/projects.module';
import { WebhooksModule } from './webhooks/webhooks.module';
import { CicdModule } from './cicd/cicd.module';
import { NotificationsModule } from './notifications/notifications.module';
import { CICDEvent } from './cicd/cicd.entity';
import { Project } from './projects/project.entity';
import { User } from './users/user.entity';
import { MonitoringModule } from './monitoring/monitoring.module';
import { JenkinsModule } from './jenkins/jenkins.module';
import { DockerModule } from './docker/docker.module';
import { LoggingMiddleware } from './middleware/logging.middleware';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get('DATABASE_URI'),
        // host: configService.get<string>('DATABASE_HOST'),
        // port: parseInt(configService.get<string>('DATABASE_PORT'), 10),
        // username: configService.get<string>('DATABASE_USERNAME'),
        // password: configService.get<string>('DATABASE_PASSWORD'),
        // database: configService.get<string>('DATABASE_NAME'),
        entities: [User, Project, CICDEvent],
        synchronize: true, // Disable in production
      }),
    }),
    ThrottlerModule.forRoot([{
      ttl: 60, // Time to live in seconds
      limit: 100, // Max number of requests within TTL
    }]),
    UsersModule,
    AuthModule,
    ProjectsModule,
    WebhooksModule,
    CicdModule,
    NotificationsModule,
    MonitoringModule,
    JenkinsModule,
    DockerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*'); // Apply to all routes
  }
}