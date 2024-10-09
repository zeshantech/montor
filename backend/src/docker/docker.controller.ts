// backend/src/docker/docker.controller.ts

import { Controller, Get, Post, Delete, Param, UseGuards, Logger } from '@nestjs/common';
import { DockerService } from './docker.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/user.entity';

@Controller('docker')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class DockerController {
  private readonly logger = new Logger(DockerController.name);

  constructor(private readonly dockerService: DockerService) {}

  @Get('containers')
  @Roles(UserRole.ADMIN, UserRole.USER)
  async listContainers() {
    this.logger.log('Fetching Docker containers');
    return this.dockerService.listContainers();
  }

  @Post('containers/:id/start')
  @Roles(UserRole.ADMIN, UserRole.USER)
  async startContainer(@Param('id') containerId: string) {
    this.logger.log(`Starting Docker container: ${containerId}`);
    return this.dockerService.startContainer(containerId);
  }

  @Post('containers/:id/stop')
  @Roles(UserRole.ADMIN, UserRole.USER)
  async stopContainer(@Param('id') containerId: string) {
    this.logger.log(`Stopping Docker container: ${containerId}`);
    return this.dockerService.stopContainer(containerId);
  }

  @Delete('containers/:id')
  @Roles(UserRole.ADMIN, UserRole.USER)
  async removeContainer(@Param('id') containerId: string) {
    this.logger.log(`Removing Docker container: ${containerId}`);
    return this.dockerService.removeContainer(containerId);
  }

  @Get('containers/:id/logs')
  @Roles(UserRole.ADMIN, UserRole.USER)
  async getContainerLogs(@Param('id') containerId: string) {
    this.logger.log(`Fetching logs for Docker container: ${containerId}`);
    return this.dockerService.getContainerLogs(containerId);
  }
}
