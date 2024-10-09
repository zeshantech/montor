import { Controller, Get, Post, Param, UseGuards, Logger } from '@nestjs/common';
import { JenkinsService } from './jenkins.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/user.entity';

@Controller('jenkins')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class JenkinsController {
  private readonly logger = new Logger(JenkinsController.name);

  constructor(private readonly jenkinsService: JenkinsService) { }

  @Get('jobs')
  @Roles(UserRole.ADMIN, UserRole.USER)
  async getJobs() {
    this.logger.log('Fetching Jenkins jobs');
    return this.jenkinsService.getJobs();
  }

  @Post('trigger/:jobName')
  @Roles(UserRole.ADMIN, UserRole.USER)
  async triggerJob(@Param('jobName') jobName: string) {
    this.logger.log(`Triggering Jenkins job: ${jobName}`);
    return this.jenkinsService.triggerJob(jobName);
  }

  @Get('status/:jobName')
  @Roles(UserRole.ADMIN, UserRole.USER)
  async getLastBuildStatus(@Param('jobName') jobName: string) {
    this.logger.log(`Fetching last build status for job: ${jobName}`);
    return this.jenkinsService.getLastBuildStatus(jobName);
  }
}
