// backend/src/cicd/cicd.module.ts

import { Module } from '@nestjs/common';
import { CicdService } from './cicd.service';
import { CicdController } from './cicd.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CICDEvent } from './cicd.entity';
import { ProjectsModule } from '../projects/projects.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CICDEvent]),
    ProjectsModule,
    NotificationsModule,
  ],
  providers: [CicdService],
  controllers: [CicdController],
  exports: [CicdService],
})
export class CicdModule {}
