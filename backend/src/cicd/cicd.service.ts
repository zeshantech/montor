

import {
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CICDEvent, BuildStatus } from './cicd.entity';
import { Project } from '../projects/project.entity';
import { NotificationsService } from '../notifications/notifications.service';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class CicdService {
  private readonly githubApiUrl = 'https://api.github.com';
  private readonly owner = 'your-github-username';
  private readonly repo = 'your-repository-name';

  constructor(
    @InjectRepository(CICDEvent)
    private cicdRepository: Repository<CICDEvent>,
    private notificationsService: NotificationsService,
    private readonly configService: ConfigService,
  ) { }


  async createCICDEvent(
    project: Project,
    eventType: string,
    status: BuildStatus,
    commitSha?: string,
    branch?: string,
  ): Promise<CICDEvent> {
    const cicdEvent = this.cicdRepository.create({
      project,
      eventType,
      status,
      commitSha,
      branch,
    });
    const savedEvent = await this.cicdRepository.save(cicdEvent);


    await this.handleNotifications(project, savedEvent);

    return savedEvent;
  }


  async getCICDEventsForProject(projectId: number): Promise<CICDEvent[]> {
    return this.cicdRepository.find({
      where: { project: { id: projectId } },
      order: { createdAt: 'DESC' },
    });
  }

  async getWorkflowRuns() {
    const githubToken = this.configService.get<string>('GITHUB_TOKEN');
    const response = await axios.get(
      `${this.githubApiUrl}/repos/${this.owner}/${this.repo}/actions/runs`,
      {
        headers: {
          Authorization: `token ${githubToken}`,
          Accept: 'application/vnd.github.v3+json',
        },
      },
    );
    return response.data;
  }



  private async handleNotifications(project: Project, event: CICDEvent) {

    if (event.status === BuildStatus.FAILURE) {

      const subject = `Build Failure for Project: ${project.name}`;
      const html = `
          <p>Hello ${project.createdBy.name},</p>
          <p>The latest build for your project <strong>${project.name}</strong> has <strong>failed</strong>.</p>
          <p><strong>Commit SHA:</strong> ${event.commitSha}</p>
          <p><strong>Branch:</strong> ${event.branch}</p>
          <p>Please investigate the issue.</p>
          <p>Regards,<br/>DevOps Dashboard</p>
        `;
      await this.notificationsService.sendEmail(
        project.createdBy.email,
        subject,
        html,
      );
    } else if (event.status === BuildStatus.SUCCESS) {

      const subject = `Build Success for Project: ${project.name}`;
      const html = `
          <p>Hello ${project.createdBy.name},</p>
          <p>The latest build for your project <strong>${project.name}</strong> has <strong>succeeded</strong>.</p>
          <p><strong>Commit SHA:</strong> ${event.commitSha}</p>
          <p><strong>Branch:</strong> ${event.branch}</p>
          <p>Keep up the good work!</p>
          <p>Regards,<br/>DevOps Dashboard</p>
        `;
      await this.notificationsService.sendEmail(
        project.createdBy.email,
        subject,
        html,
      );
    }


  }
}
