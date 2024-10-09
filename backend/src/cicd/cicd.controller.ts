// backend/src/cicd/cicd.controller.ts

import { Controller, Get, Param, UseGuards, Req } from '@nestjs/common';
import { CicdService } from './cicd.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/user.entity';

@Controller('cicd')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class CicdController {
  constructor(private readonly cicdService: CicdService) { }

  @Get(':projectId/events')
  @Roles(UserRole.ADMIN, UserRole.USER)
  async getCICDEvents(
    @Param('projectId') projectId: string,
  ) {
    return this.cicdService.getCICDEventsForProject(+projectId);
  }


  @Get('workflow-runs')
  @Roles(UserRole.ADMIN, UserRole.USER)
  async getWorkflowRuns() {
    return this.cicdService.getWorkflowRuns();
  }
}
