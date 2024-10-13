// backend/src/projects/projects.service.ts

import {
    Injectable,
    NotFoundException,
    ForbiddenException,
    BadRequestException,
  } from '@nestjs/common';
  import { InjectRepository } from '@nestjs/typeorm';
  import { Repository } from 'typeorm';
  import { Project } from './project.entity';
  import { User } from '../users/user.entity';
  import { v4 as uuidv4 } from 'uuid';
  import axios from 'axios';
  import { ConfigService } from '@nestjs/config';
  import { NotificationsService } from '../notifications/notifications.service';
import { ConnectRepoDto, CreateProjectDto, UpdateProjectDto } from './dto/project.dto';
  
  @Injectable()
  export class ProjectsService {
    constructor(
      @InjectRepository(Project)
      private projectsRepository: Repository<Project>,
      private configService: ConfigService,
    ) {}
  
    // Create a new project
    async create(
      createProjectDto: CreateProjectDto,
      user: User,
    ): Promise<Project> {
      const project = this.projectsRepository.create({
        ...createProjectDto,
        createdBy: user,
      });
      return this.projectsRepository.save(project);
    }
  
    async findAll(user: User): Promise<Project[]> {
      return this.projectsRepository.find({
        where: { createdBy: user },
      });
    }
  
    // Retrieve a single project
    async findOne(id: number, user: User): Promise<Project> {
      const project = await this.projectsRepository.findOne({
        where: { id },
      });
      if (!project) {
        throw new NotFoundException('Project not found');
      }
      
      return project;
    }
  
    // Update a project
    async update(
      id: number,
      updateProjectDto: UpdateProjectDto,
      user: User,
    ): Promise<Project> {
      const project = await this.findOne(id, user);
      Object.assign(project, updateProjectDto);
      return this.projectsRepository.save(project);
    }
  
    // Delete a project
    async remove(id: number, user: User): Promise<void> {
      const project = await this.findOne(id, user);
      await this.projectsRepository.remove(project);
    }
  
    // Connect GitHub repository and set up webhook
    async connectRepository(
      id: number,
      connectRepoDto: ConnectRepoDto,
      user: User,
    ): Promise<Project> {
      const project = await this.findOne(id, user);
  
      // Extract owner and repo name from repositoryUrl
      const regex = /https:\/\/github\.com\/([^\/]+)\/([^\/]+)(\.git)?$/;
      const match = connectRepoDto.repositoryUrl.match(regex);
      if (!match) {
        throw new BadRequestException('Invalid GitHub repository URL');
      }
      const owner = match[1];
      const repo = match[2];
  
      // Generate a unique webhook secret
      const webhookSecret = uuidv4();
  
      // Create GitHub webhook
      try {
        // To create a webhook, authenticate with GitHub using a token with admin:repo_hook permissions
        const githubToken = this.configService.get<string>('GITHUB_TOKEN');
        if (!githubToken) {
          throw new Error('GitHub token not configured');
        }
  
        const response = await axios.post(
          `https://api.github.com/repos/${owner}/${repo}/hooks`,
          {
            name: 'web',
            active: true,
            events: ['push', 'pull_request'],
            config: {
              url: `${this.configService.get<string>('HOST_URL')}/webhooks/github`,
              content_type: 'json',
              secret: webhookSecret,
              insecure_ssl: '0',
            },
          },
          {
            headers: {
              Authorization: `token ${githubToken}`,
              Accept: 'application/vnd.github.v3+json',
            },
          },
        );
  
        if (response.status === 201) {
          project.githubRepoId = response.data.id;
          project.webhookSecret = webhookSecret;
          project.isWebhookActive = true;
          await this.projectsRepository.save(project);
          return project;
        } else {
          throw new Error('Failed to create GitHub webhook');
        }
      } catch (error) {
        throw new BadRequestException(
          `Error connecting to GitHub repository: ${error.message}`,
        );
      }
    }
  }
  