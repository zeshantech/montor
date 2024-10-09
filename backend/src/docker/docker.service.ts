// backend/src/docker/docker.service.ts

import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DockerService {
  private readonly logger = new Logger(DockerService.name);
  private readonly dockerApi: AxiosInstance;

  constructor(private readonly configService: ConfigService) {
    const dockerHost = this.configService.get<string>('DOCKER_HOST') || 'http://localhost:2375';
    this.dockerApi = axios.create({
      baseURL: dockerHost,
      timeout: 5000, // 5 seconds timeout
    });
  }

  // List Docker containers
  async listContainers(): Promise<any> {
    try {
      const response = await this.dockerApi.get('/containers/json?all=1');
      return response.data;
    } catch (error) {
      this.logger.error('Failed to list Docker containers', error.message);
      throw new InternalServerErrorException('Failed to list Docker containers');
    }
  }

  // Start a Docker container
  async startContainer(containerId: string): Promise<any> {
    try {
      const response = await this.dockerApi.post(`/containers/${containerId}/start`);
      return { message: `Container ${containerId} started successfully.` };
    } catch (error) {
      this.logger.error(`Failed to start Docker container: ${containerId}`, error.message);
      throw new InternalServerErrorException(`Failed to start Docker container: ${containerId}`);
    }
  }

  // Stop a Docker container
  async stopContainer(containerId: string): Promise<any> {
    try {
      const response = await this.dockerApi.post(`/containers/${containerId}/stop`);
      return { message: `Container ${containerId} stopped successfully.` };
    } catch (error) {
      this.logger.error(`Failed to stop Docker container: ${containerId}`, error.message);
      throw new InternalServerErrorException(`Failed to stop Docker container: ${containerId}`);
    }
  }

  // Remove a Docker container
  async removeContainer(containerId: string): Promise<any> {
    try {
      const response = await this.dockerApi.delete(`/containers/${containerId}?force=true`);
      return { message: `Container ${containerId} removed successfully.` };
    } catch (error) {
      this.logger.error(`Failed to remove Docker container: ${containerId}`, error.message);
      throw new InternalServerErrorException(`Failed to remove Docker container: ${containerId}`);
    }
  }

  // Get Docker container logs
  async getContainerLogs(containerId: string): Promise<any> {
    try {
      const response = await this.dockerApi.get(`/containers/${containerId}/logs?stdout=1&stderr=1&timestamps=1`);
      return response.data;
    } catch (error) {
      this.logger.error(`Failed to get logs for Docker container: ${containerId}`, error.message);
      throw new InternalServerErrorException(`Failed to get logs for Docker container: ${containerId}`);
    }
  }
}
