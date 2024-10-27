import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './project.entity';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from '@nestjs/config';
import { CreateProjectDto, UpdateProjectDto } from './dto/project.dto';
import { OctokitService } from 'nestjs-octokit';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/user.entity';
import { parseRepositoryUrl } from 'src/common/utils/parseRepositoryUrl';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
    private readonly octokitService: OctokitService,
    private usersService: UsersService,
    private configService: ConfigService,
  ) {}

  async createProject(input: CreateProjectDto, user: User) {
    const project = new Project();
    project.description = input.description;
    project.isPrivate = input.isPrivate;
    project.repositoryUrl = input.repositoryUrl;
    project.name = input.name;
    project.user = user;
    project.accessToken = input.accessToken;

    if (input.repositoryUrl) {
      let url = input.repositoryUrl;
      if (input.accessToken) {
        url = this.embedTokenInUrl(url, input.accessToken);
      }
      const result = await this.connectToRemoteRepository(url);
      project.githubRepoId = result.id;
      project.webhookSecret = result.webhookSecret;
      project.isWebhookActive = result.isWebhookActive;
    }

    await project.save();
  }

  async getUserAllProjects(userId: string): Promise<Project[]> {
    return this.projectsRepository.findBy({ user: { id: userId } });
  }

  async getUserProjectById(id: string, userId: string): Promise<Project> {
    const project = await this.projectsRepository.findOne({
      where: { id, user: { id: userId } },
    });
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }

  async getOneById(id: string): Promise<Project> {
    const project = await this.projectsRepository.findOne({
      where: { id },
    });
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }

  async removeProject(id: string, userId: string): Promise<void> {
    const project = await this.getUserProjectById(id, userId);
    await project.remove();
  }

  async updateProject(id: string, input: UpdateProjectDto, userId: string) {
    try {
      const project = await this.getUserProjectById(id, userId);

      if (input.repositoryUrl) {
        let url = input.repositoryUrl;
        if (input.accessToken) {
          url = this.embedTokenInUrl(url, input.accessToken);
        }
        const result = await this.connectToRemoteRepository(url);
        project.githubRepoId = result.id;
        project.webhookSecret = result.webhookSecret;
        project.isWebhookActive = result.isWebhookActive;
      }

      if (input.accessToken) project.accessToken = input.accessToken;
      if (input.isPrivate) project.isPrivate = input.isPrivate;
      if (input.repositoryUrl) project.repositoryUrl = input.repositoryUrl;
      if (input.name) project.name = input.name;
      if (input.description) project.description = input.description;

      await project.save();
    } catch (error) {
      throw new BadRequestException(
        `Error connecting to GitHub repository: ${error.message}`,
      );
    }
  }

  async findOneByFilters(filters: Record<string, any>) {
    const project = await this.projectsRepository.findOneBy({
      ...filters,
    });

    return project;
  }

  async connectToRemoteRepository(url: string) {
    const { owner, repo } = parseRepositoryUrl(url);

    const webhookSecret = uuidv4();

    try {
      const githubToken = this.configService.get<string>('GITHUB_TOKEN');
      if (!githubToken) {
        throw new Error('GitHub token not configured');
      }

      const response = await this.octokitService.request(
        `POST /repos/${owner}/${repo}/hooks`,
        {
          name: 'web',
          active: true,
          events: ['push', 'pull_request'],
          config: {
            url: `${this.configService.get<string>('HOST_URL')}/webhooks/github`,
            content_type: 'json',
            insecure_ssl: 1,
            secret: webhookSecret,
          },
          headers: {
            'X-GitHub-Api-Version': '2022-11-28',
            Accept: 'application/vnd.github.v3+json',
          },
        },
      );

      if (response.status === 201) {
        return { id: response.data.id, webhookSecret, isWebhookActive: true };
      } else {
        throw new Error('Failed to create GitHub webhook');
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  // Helper function to embed token into repository URL
  embedTokenInUrl(url: string, token: string): string {
    // Example: https://token@github.com/user/repo.git
    return url.replace(/^https?:\/\//, `https://${encodeURIComponent(token)}@`);
  }
}
