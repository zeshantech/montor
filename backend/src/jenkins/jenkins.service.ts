import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JenkinsService {
  private readonly logger = new Logger(JenkinsService.name);
  private readonly jenkinsApi: AxiosInstance;

  constructor(private readonly configService: ConfigService) {
    const jenkinsUrl = this.configService.get<string>('JENKINS_URL');
    const jenkinsUser = this.configService.get<string>('JENKINS_USER');
    const jenkinsToken = this.configService.get<string>('JENKINS_TOKEN');

    if (!jenkinsUrl || !jenkinsUser || !jenkinsToken) {
      this.logger.error(
        'Jenkins configuration is missing in environment variables.',
      );
      throw new UnauthorizedException('Jenkins configuration is incomplete.');
    }

    this.jenkinsApi = axios.create({
      baseURL: jenkinsUrl,
      auth: {
        username: jenkinsUser,
        password: jenkinsToken,
      },
    });
  }

  // Get list of Jenkins jobs
  async getJobs(): Promise<any> {
    try {
      const response = await this.jenkinsApi.get(
        '/api/json?tree=jobs[name,color]',
      );
      return response.data.jobs;
    } catch (error) {
      this.logger.error('Failed to fetch Jenkins jobs', error.message);
      throw error;
    }
  }

  // Trigger a Jenkins job build
  async triggerJob(jobName: string): Promise<any> {
    // try {
    //   const response = await this.jenkinsApi.post(`/job/${encodeURIComponent(jobName)}/build`);
    //   if (response.status === 201) {
    //     this.logger.log(`Triggered Jenkins job: ${jobName}`);
    //     return { message: `Triggered Jenkins job: ${jobName}` };
    //   }
    //   throw new Error(`Unexpected response status: ${response.status}`);
    // } catch (error) {
    //   this.logger.error(`Failed to trigger Jenkins job: ${jobName}`, error.message);
    //   throw error;
    // }
    try {
      // Fetch CSRF crumb
      const crumbResponse = await this.jenkinsApi.get('/crumbIssuer/api/json');
      const crumb = crumbResponse.data.crumb;
      const crumbField = crumbResponse.data.crumbRequestField;

      // Trigger job with crumb
      const response = await this.jenkinsApi.post(
        `/job/${encodeURIComponent(jobName)}/build`,
        {},
        {
          headers: {
            [crumbField]: crumb,
          },
        },
      );

      if (response.status === 201) {
        this.logger.log(`Triggered Jenkins job: ${jobName}`);
        return { message: `Triggered Jenkins job: ${jobName}` };
      }
      throw new Error(`Unexpected response status: ${response.status}`);
    } catch (error) {
      this.logger.error(
        `Failed to trigger Jenkins job: ${jobName}`,
        error.message,
      );
      throw error;
    }
  }

  // Get last build status of a job
  async getLastBuildStatus(jobName: string): Promise<any> {
    try {
      const response = await this.jenkinsApi.get(
        `/job/${encodeURIComponent(jobName)}/lastBuild/api/json`,
      );
      return {
        result: response.data.result,
        duration: response.data.duration,
        timestamp: response.data.timestamp,
      };
    } catch (error) {
      this.logger.error(
        `Failed to fetch last build status for job: ${jobName}`,
        error.message,
      );
      throw error;
    }
  }
}
