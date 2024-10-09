// backend/src/jenkins/jenkins.module.ts

import { Module } from '@nestjs/common';
import { JenkinsService } from './jenkins.service';
import { JenkinsController } from './jenkins.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [JenkinsService],
  controllers: [JenkinsController],
  exports: [JenkinsService],
})
export class JenkinsModule {}
