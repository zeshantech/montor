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
  import { CreateProjectDto, UpdateProjectDto, ConnectRepoDto } from './dto/project.dto';
import { AuthGuard } from 'src/auth/auth.guard';
  
  @Controller('projects')
  @UseGuards(AuthGuard)
  export class ProjectsController {
    constructor(private readonly projectsService: ProjectsService) {}
  
    @Post()
    async create(
      @Body() createProjectDto: CreateProjectDto,
      @Req() req,
    ) {
      return this.projectsService.create(createProjectDto, req.user);
    }
  
    @Get()
    async findAll(@Req() req) {
      return this.projectsService.findAll(req.user);
    }
  
    @Get(':id')
    async findOne(@Param('id') id: string, @Req() req) {
      return this.projectsService.findOne(+id, req.user);
    }
  
    @Put(':id')
    async update(
      @Param('id') id: string,
      @Body() updateProjectDto: UpdateProjectDto,
      @Req() req,
    ) {
      return this.projectsService.update(+id, updateProjectDto, req.user);
    }
  
    @Delete(':id')
    async remove(@Param('id') id: string, @Req() req) {
      await this.projectsService.remove(+id, req.user);
      return { message: 'Project deleted successfully.' };
    }
  
    @Post(':id/connect-repo')
    async connectRepository(
      @Param('id') id: string,
      @Body() connectRepoDto: ConnectRepoDto,
      @Req() req,
    ) {
      return this.projectsService.connectRepository(+id, connectRepoDto, req.user);
    }
  }
  