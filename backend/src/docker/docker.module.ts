// backend/src/docker/docker.module.ts

import { Module } from '@nestjs/common';
import { DockerService } from './docker.service';
import { DockerController } from './docker.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [DockerService],
  controllers: [DockerController],
  exports: [DockerService],
})
export class DockerModule {}
