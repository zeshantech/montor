// backend/src/cicd/cicd.controller.ts

import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { CicdService } from './cicd.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('cicd')
@UseGuards(AuthGuard)
export class CicdController {
  constructor(private readonly cicdService: CicdService) { }

  @Get(':projectId/events')
  async getCICDEvents(
    @Param('projectId') projectId: string,
  ) {
    return this.cicdService.getCICDEventsForProject(+projectId);
  }


  @Get('workflow-runs')
  async getWorkflowRuns() {
    return this.cicdService.getWorkflowRuns();
  }
}
