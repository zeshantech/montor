import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Put,
    Delete,
    UseGuards,
    Req,
  } from '@nestjs/common';
  import { ProjectsService } from './projects.service';
  import { CreateProjectDto } from './dto/create-project.dto';
  import { UpdateProjectDto } from './dto/update-project.dto';
  import { ConnectRepoDto } from './dto/connect-repo.dto';
  import { AuthGuard } from '@nestjs/passport';
  import { RolesGuard } from '../auth/roles.guard';
  import { Roles } from '../auth/roles.decorator';
  import { UserRole } from '../users/user.entity';
  
  @Controller('projects')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  export class ProjectsController {
    constructor(private readonly projectsService: ProjectsService) {}
  
    @Post()
    @Roles(UserRole.ADMIN, UserRole.USER)
    async create(
      @Body() createProjectDto: CreateProjectDto,
      @Req() req,
    ) {
      return this.projectsService.create(createProjectDto, req.user);
    }
  
    @Get()
    @Roles(UserRole.ADMIN, UserRole.USER)
    async findAll(@Req() req) {
      return this.projectsService.findAll(req.user);
    }
  
    @Get(':id')
    @Roles(UserRole.ADMIN, UserRole.USER)
    async findOne(@Param('id') id: string, @Req() req) {
      return this.projectsService.findOne(+id, req.user);
    }
  
    @Put(':id')
    @Roles(UserRole.ADMIN, UserRole.USER)
    async update(
      @Param('id') id: string,
      @Body() updateProjectDto: UpdateProjectDto,
      @Req() req,
    ) {
      return this.projectsService.update(+id, updateProjectDto, req.user);
    }
  
    @Delete(':id')
    @Roles(UserRole.ADMIN, UserRole.USER)
    async remove(@Param('id') id: string, @Req() req) {
      await this.projectsService.remove(+id, req.user);
      return { message: 'Project deleted successfully.' };
    }
  
    @Post(':id/connect-repo')
    @Roles(UserRole.ADMIN, UserRole.USER)
    async connectRepository(
      @Param('id') id: string,
      @Body() connectRepoDto: ConnectRepoDto,
      @Req() req,
    ) {
      return this.projectsService.connectRepository(+id, connectRepoDto, req.user);
    }
  }
  