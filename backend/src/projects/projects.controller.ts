import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto, UpdateProjectDto } from './dto/project.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { CurrentUser } from 'src/common/current-user.decorator';
import { User } from 'src/users/user.entity';

@Controller('projects')
@UseGuards(AuthGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  async createProject(
    @Body() createProjectDto: CreateProjectDto,
    @CurrentUser() user: User,
  ) {
    return this.projectsService.createProject(createProjectDto, user);
  }

  @Get()
  async getUserAllProjects(@CurrentUser() user: User) {
    return this.projectsService.getUserAllProjects(user.id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @CurrentUser() user: User) {
    return this.projectsService.getUserProjectById(id, user.id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
    @CurrentUser() user: User,
  ) {
    return this.projectsService.updateProject(id, updateProjectDto, user.id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @CurrentUser() user: User) {
    await this.projectsService.removeProject(id, user.id);
    return { message: 'Project deleted successfully.' };
  }

  // @Post(':id/connect-repo')
  // async connectRepository(
  //   @Param('id') id: string,
  //   @Body() connectRepoDto: ConnectRepoDto,
  //   @CurrentUser() user: User,
  // ) {
  //   return this.projectsService.connectRepository(
  //     +id,
  //     connectRepoDto,
  //     user.id,
  //   );
  // }
}
