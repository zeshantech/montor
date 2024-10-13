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
      timeout: 5000,
    });
  }
  // constructor(private readonly configService: ConfigService) {
  //   const dockerHost = this.configService.get<string>('DOCKER_HOST') || 'http://localhost:2375';
    
  //   // If using Unix socket
  //   if (dockerHost.startsWith('unix://')) {
  //     const socketPath = dockerHost.replace('unix://', '');
  //     this.dockerApi = axios.create({
  //       baseURL: 'http://localhost', 
  //       httpAgent: new http.Agent({ socketPath }),
  //     });
  //   } else {
  //     // HTTPS setup if Docker API is secured
  //     const dockerCertPath = this.configService.get<string>('DOCKER_CERT_PATH');
  //     const dockerKeyPath = this.configService.get<string>('DOCKER_KEY_PATH');
  //     const dockerCaPath = this.configService.get<string>('DOCKER_CA_PATH');

  //     if (dockerCertPath && dockerKeyPath && dockerCaPath) {
  //       this.dockerApi = axios.create({
  //         baseURL: dockerHost,
  //         httpsAgent: new https.Agent({
  //           cert: fs.readFileSync(dockerCertPath),
  //           key: fs.readFileSync(dockerKeyPath),
  //           ca: fs.readFileSync(dockerCaPath),
  //         }),
  //       });
  //     } else {
  //       this.dockerApi = axios.create({
  //         baseURL: dockerHost,
  //         timeout: 5000, // 5 seconds timeout
  //       });
  //     }
  //   }
  // }

  async listContainers(): Promise<any> {
    try {
      const response = await this.dockerApi.get('/containers/json?all=1');
      return response.data;
    } catch (error) {
      this.logger.error('Failed to list Docker containers', error.message);
      throw new InternalServerErrorException('Failed to list Docker containers');
    }
  }

  async startContainer(containerId: string): Promise<any> {
    try {
      const response = await this.dockerApi.post(`/containers/${containerId}/start`);
      return { message: `Container ${containerId} started successfully.` };
    } catch (error) {
      this.logger.error(`Failed to start Docker container: ${containerId}`, error.message);
      throw new InternalServerErrorException(`Failed to start Docker container: ${containerId}`);
    }
  }

  async stopContainer(containerId: string): Promise<any> {
    try {
      const response = await this.dockerApi.post(`/containers/${containerId}/stop`);
      return { message: `Container ${containerId} stopped successfully.` };
    } catch (error) {
      this.logger.error(`Failed to stop Docker container: ${containerId}`, error.message);
      throw new InternalServerErrorException(`Failed to stop Docker container: ${containerId}`);
    }
  }

  async removeContainer(containerId: string): Promise<any> {
    try {
      const response = await this.dockerApi.delete(`/containers/${containerId}?force=true`);
      return { message: `Container ${containerId} removed successfully.` };
    } catch (error) {
      this.logger.error(`Failed to remove Docker container: ${containerId}`, error.message);
      throw new InternalServerErrorException(`Failed to remove Docker container: ${containerId}`);
    }
  }

  async getContainerLogs(containerId: string): Promise<any> {
    try {
      // const response = await this.dockerApi.get(`/containers/${containerId}/logs?stdout=1&stderr=1&timestamps=1`);
      const response = await this.dockerApi.get(`/containers/${containerId}/logs`, {
        params: {
          stdout: 1,
          stderr: 1,
          timestamps: 1,
          follow: 0, // Set to 1 if streaming logs
        },
        responseType: 'text',
      });
      return response.data;
    } catch (error) {
      this.logger.error(`Failed to get logs for Docker container: ${containerId}`, error.message);
      throw new InternalServerErrorException(`Failed to get logs for Docker container: ${containerId}`);
    }
  }
}
