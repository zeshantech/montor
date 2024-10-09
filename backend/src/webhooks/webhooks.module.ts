// backend/src/webhooks/webhooks.module.ts

import { Module } from '@nestjs/common';
import { WebhooksService } from './webhooks.service';
import { WebhooksController } from './webhooks.controller';
import { ProjectsModule } from '../projects/projects.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from '../projects/project.entity';
import { CicdModule } from '../cicd/cicd.module';

@Module({
  imports: [ProjectsModule, TypeOrmModule.forFeature([Project]), CicdModule],
  providers: [WebhooksService],
  controllers: [WebhooksController],
})
export class WebhooksModule {}
