// backend/src/docker/docker.controller.ts

import { Controller, Get, Post, Delete, Param, UseGuards, Logger } from '@nestjs/common';
import { DockerService } from './docker.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('docker')
@UseGuards(AuthGuard)
export class DockerController {
  private readonly logger = new Logger(DockerController.name);

  constructor(private readonly dockerService: DockerService) {}

  @Get('containers')
  async listContainers() {
    this.logger.log('Fetching Docker containers');
    return this.dockerService.listContainers();
  }

  @Post('containers/:id/start')
  async startContainer(@Param('id') containerId: string) {
    this.logger.log(`Starting Docker container: ${containerId}`);
    return this.dockerService.startContainer(containerId);
  }

  @Post('containers/:id/stop')
  async stopContainer(@Param('id') containerId: string) {
    this.logger.log(`Stopping Docker container: ${containerId}`);
    return this.dockerService.stopContainer(containerId);
  }

  @Delete('containers/:id')
  async removeContainer(@Param('id') containerId: string) {
    this.logger.log(`Removing Docker container: ${containerId}`);
    return this.dockerService.removeContainer(containerId);
  }

  @Get('containers/:id/logs')
  async getContainerLogs(@Param('id') containerId: string) {
    this.logger.log(`Fetching logs for Docker container: ${containerId}`);
    return this.dockerService.getContainerLogs(containerId);
  }
}
