// backend/src/webhooks/webhooks.service.ts

import {
    Injectable,
    BadRequestException,
    Logger,
  } from '@nestjs/common';
  import { ProjectsService } from '../projects/projects.service';
  import { Project } from '../projects/project.entity';
  import { Repository } from 'typeorm';
  import { InjectRepository } from '@nestjs/typeorm';
  import * as crypto from 'crypto';
  import { CicdService } from '../cicd/cicd.service';
  import { CICDEvent, BuildStatus } from '../cicd/cicd.entity';
  
  @Injectable()
  export class WebhooksService {
    private readonly logger = new Logger(WebhooksService.name);
  
    constructor(
      private readonly projectsService: ProjectsService,
      private readonly cicdService: CicdService,
      @InjectRepository(Project)
      private projectsRepository: Repository<Project>,
    ) {}
  
    // Verify GitHub webhook signature
    verifySignature(
      payload: Buffer,
      signature: string,
      secret: string,
    ): boolean {
      const hmac = crypto.createHmac('sha256', secret);
      hmac.update(payload);
      const digest = 'sha256=' + hmac.digest('hex');
      return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature));
    }
  
    // Handle incoming webhook events
    async handleGitHubWebhook(headers: any, body: any): Promise<void> {
      const signature = headers['x-hub-signature-256'];
      const event = headers['x-github-event'];
      const delivery = headers['x-github-delivery'];
  
      if (!signature) {
        throw new BadRequestException('Missing signature');
      }
  
      const repositoryId = body.repository.id;
  
      // Find the project with the matching GitHub repository ID
      const project = await this.projectsRepository.findOne({
        where: { githubRepoId: repositoryId, isWebhookActive: true },
      });
  
      if (!project) {
        this.logger.warn(
          `No active project found for repository ID: ${repositoryId}`,
        );
        return;
      }
  
      // Verify signature
      const isValid = this.verifySignature(
        Buffer.from(JSON.stringify(body)),
        signature,
        project.webhookSecret,
      );
  
      if (!isValid) {
        throw new BadRequestException('Invalid signature');
      }
  
      // Process the event
      this.logger.log(
        `Received event ${event} for project ${project.name}`,
      );
  
      // Handle specific events
      switch (event) {
        case 'push':
          await this.handlePushEvent(project, body);
          break;
        case 'pull_request':
          await this.handlePullRequestEvent(project, body);
          break;
        // Add more cases as needed
        default:
          this.logger.warn(`Unhandled event type: ${event}`);
      }
    }
  
    // Handle Push Events
    async handlePushEvent(project: Project, body: any): Promise<void> {
      const commitSha = body.after;
      const branch = body.ref.split('/').pop();
  
      // Determine build status based on commit statuses
      // For simplicity, assume a successful build if no failures are reported
      // In a real-world scenario, integrate with GitHub Status API or CI tool APIs
  
      // Example: Create a CI/CD event with status IN_PROGRESS
      const cicdEventInProgress = await this.cicdService.createCICDEvent(
        project,
        'push',
        BuildStatus.IN_PROGRESS,
        commitSha,
        branch,
      );
  
      // TODO: Integrate with CI tool to trigger build and update status accordingly
      // For demonstration, we'll simulate a successful build after some processing
  
      // Simulate build success after processing
      await this.cicdService.createCICDEvent(
        project,
        'push',
        BuildStatus.SUCCESS,
        commitSha,
        branch,
      );
    }
  
    // Handle Pull Request Events
    async handlePullRequestEvent(project: Project, body: any): Promise<void> {
      const action = body.action;
      const pullRequest = body.pull_request;
      const commitSha = pullRequest.head.sha;
      const branch = pullRequest.head.ref;
  
      if (action === 'opened' || action === 'synchronize') {
        // Create a CI/CD event with status IN_PROGRESS
        const cicdEventInProgress = await this.cicdService.createCICDEvent(
          project,
          'pull_request',
          BuildStatus.IN_PROGRESS,
          commitSha,
          branch,
        );
  
        // TODO: Integrate with CI tool to trigger build and update status accordingly
        // For demonstration, we'll simulate a successful build after some processing
  
        // Simulate build success after processing
        await this.cicdService.createCICDEvent(
          project,
          'pull_request',
          BuildStatus.SUCCESS,
          commitSha,
          branch,
        );
      } else if (action === 'closed') {
        if (body.pull_request.merged) {
          // Handle merged pull request
          await this.cicdService.createCICDEvent(
            project,
            'pull_request',
            BuildStatus.SUCCESS,
            body.pull_request.merge_commit_sha,
            body.pull_request.base.ref,
          );
        } else {
          // Handle pull request closed without merge
          await this.cicdService.createCICDEvent(
            project,
            'pull_request',
            BuildStatus.FAILURE,
            body.pull_request.head.sha,
            body.pull_request.head.ref,
          );
        }
      }
    }
  }
  