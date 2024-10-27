import { BadGatewayException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CICDEvent, BuildStatus } from './cicd.entity';
import { NotificationsService } from '../notifications/notifications.service';
import { OctokitService } from 'nestjs-octokit';
import { ProjectsService } from 'src/projects/projects.service';
import { UsersService } from 'src/users/users.service';
import { parseRepositoryUrl } from 'src/common/utils/parseRepositoryUrl';
import * as unzipper from 'unzipper';

@Injectable()
export class CicdService {
  constructor(
    @InjectRepository(CICDEvent)
    private cicdRepository: Repository<CICDEvent>,
    private notificationsService: NotificationsService,
    private readonly octokitService: OctokitService,
    private readonly projectService: ProjectsService,
    private readonly userService: UsersService,
  ) {}

  async createCICDEvent(
    projectId: string,
    eventType: string,
    status: BuildStatus,
    commitSha: string,
    branch: string,
  ): Promise<CICDEvent> {
    const project = await this.projectService.getOneById(projectId);

    const cicdEvent = this.cicdRepository.create({
      project,
      eventType,
      status,
      commitSha,
      branch,
    });
    const savedEvent = await this.cicdRepository.save(cicdEvent);
    await this.handleNotifications(projectId, savedEvent);

    return savedEvent;
  }

  async getCICDEventsForProject(projectId: string): Promise<CICDEvent[]> {
    return this.cicdRepository.find({
      where: { project: { id: projectId } },
      order: { createdAt: 'DESC' },
    });
  }

  async getWorkflowRuns(projectId: string) {
    const project = await this.projectService.getOneById(projectId);
    if (!project.isWebhookActive) {
      throw new BadGatewayException('project is not connected');
    }

    const { owner, repo } = parseRepositoryUrl(project.repositoryUrl);

    const runs = await this.octokitService.rest.actions.listWorkflowRunsForRepo(
      { owner, repo },
    );
    return runs.data.workflow_runs;
  }

  async triggerWorkflow(projectId: string, workflowName: string, ref: string) {
    const project = await this.projectService.getOneById(projectId);

    if (!project.isWebhookActive) {
      throw new BadGatewayException('Project is not connected');
    }

    const { owner, repo } = parseRepositoryUrl(project.repositoryUrl);

    try {
      const response =
        await this.octokitService.rest.actions.createWorkflowDispatch({
          owner,
          repo,
          workflow_id: workflowName,
          ref,
        });

      return {
        message: 'Workflow triggered successfully',
        status: response.status,
      };
    } catch (error) {
      console.error('Error triggering workflow:', error);
      throw new BadGatewayException('Failed to trigger workflow');
    }
  }

  async rerunWorkflow(projectId: string, workflowRunId: number) {
    const project = await this.projectService.getOneById(projectId);

    if (!project.isWebhookActive) {
      throw new BadGatewayException('Project is not connected');
    }

    const { owner, repo } = parseRepositoryUrl(project.repositoryUrl);

    try {
      const response = await this.octokitService.rest.actions.reRunWorkflow({
        owner,
        repo,
        run_id: workflowRunId,
      });

      return {
        message: 'Workflow rerun triggered successfully',
        status: response.status,
      };
    } catch (error) {
      console.error('Error rerunning workflow:', error);
      throw new BadGatewayException('Failed to rerun workflow');
    }
  }

  async cancelWorkflow(projectId: string, workflowRunId: number) {
    const project = await this.projectService.getOneById(projectId);

    if (!project.isWebhookActive) {
      throw new BadGatewayException('Project is not connected');
    }

    const { owner, repo } = parseRepositoryUrl(project.repositoryUrl);

    try {
      const response = await this.octokitService.rest.actions.cancelWorkflowRun(
        {
          owner,
          repo,
          run_id: workflowRunId,
        },
      );

      return {
        message: 'Workflow cancelled successfully',
        status: response.status,
      };
    } catch (error) {
      console.error('Error cancelling workflow:', error);
      throw new BadGatewayException('Failed to cancel workflow');
    }
  }

  async downloadWorkflowLogs(projectId: string, workflowRunId: number) {
    const project = await this.projectService.getOneById(projectId);

    if (!project.isWebhookActive) {
      throw new BadGatewayException('Project is not connected');
    }

    const { owner, repo } = parseRepositoryUrl(project.repositoryUrl);

    try {
      const response =
        await this.octokitService.rest.actions.downloadWorkflowRunLogs({
          owner,
          repo,
          run_id: workflowRunId,
        });

      const buffer = Buffer.from(response.data as ArrayBuffer);

      const directory = await unzipper.Open.buffer(buffer);

      let allLogs = '';

      for (const file of directory.files) {
        if (!file.path.endsWith('/')) {
          const contentBuffer = await file.buffer();
          const content = contentBuffer.toString('utf-8');

          allLogs += `\n--- ${file.path} ---\n${content}\n`;
        }
      }

      return {
        message: 'Logs downloaded successfully',
        logs: allLogs,
      };
    } catch (error) {
      console.error('Error downloading logs:', error);
      throw new BadGatewayException('Failed to download logs');
    }
  }

  async getWorkflowArtifacts(projectId: string, workflowRunId: number) {
    const project = await this.projectService.getOneById(projectId);

    if (!project.isWebhookActive) {
      throw new BadGatewayException('Project is not connected');
    }

    const { owner, repo } = parseRepositoryUrl(project.repositoryUrl);

    try {
      const response =
        await this.octokitService.rest.actions.listWorkflowRunArtifacts({
          owner,
          repo,
          run_id: workflowRunId,
        });

      return {
        message: 'Artifacts retrieved successfully',
        artifacts: response.data.artifacts,
      };
    } catch (error) {
      console.error('Error retrieving artifacts:', error);
      throw new BadGatewayException('Failed to retrieve artifacts');
    }
  }

  private async handleNotifications(projectId: string, event: CICDEvent) {
    const project = await this.projectService.getOneById(projectId);
    const user = await this.userService.getById(project.user.id);

    if (event.status === BuildStatus.FAILURE) {
      const subject = `Build Failure for Project: ${project.name}`;
      const html = `
          <p>Hello ${user.name},</p>
          <p>The latest build for your project <strong>${project.name}</strong> has <strong>failed</strong>.</p>
          <p><strong>Commit SHA:</strong> ${event.commitSha}</p>
          <p><strong>Branch:</strong> ${event.branch}</p>
          <p>Please investigate the issue.</p>
          <p>Regards,<br/>DevOps Dashboard</p>
        `;
      await this.notificationsService.sendEmail(user.email, subject, html);
    } else if (event.status === BuildStatus.SUCCESS) {
      const subject = `Build Success for Project: ${project.name}`;
      const html = `
          <p>Hello ${user.name},</p>
          <p>The latest build for your project <strong>${project.name}</strong> has <strong>succeeded</strong>.</p>
          <p><strong>Commit SHA:</strong> ${event.commitSha}</p>
          <p><strong>Branch:</strong> ${event.branch}</p>
          <p>Keep up the good work!</p>
          <p>Regards,<br/>DevOps Dashboard</p>
        `;
      await this.notificationsService.sendEmail(user.email, subject, html);
    }
  }
}
