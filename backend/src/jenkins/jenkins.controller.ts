import { Controller, Get, Post, Param, UseGuards, Logger } from '@nestjs/common';
import { JenkinsService } from './jenkins.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('jenkins')
@UseGuards(AuthGuard)
export class JenkinsController {
  private readonly logger = new Logger(JenkinsController.name);

  constructor(private readonly jenkinsService: JenkinsService) { }

  @Get('jobs')
  async getJobs() {
    this.logger.log('Fetching Jenkins jobs');
    return this.jenkinsService.getJobs();
  }

  @Post('trigger/:jobName')
  async triggerJob(@Param('jobName') jobName: string) {
    this.logger.log(`Triggering Jenkins job: ${jobName}`);
    return this.jenkinsService.triggerJob(jobName);
  }

  @Get('status/:jobName')
  async getLastBuildStatus(@Param('jobName') jobName: string) {
    this.logger.log(`Fetching last build status for job: ${jobName}`);
    return this.jenkinsService.getLastBuildStatus(jobName);
  }
}
