import { Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { CicdService, LogEntry } from './cicd.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('cicd')
@UseGuards(AuthGuard)
export class CicdController {
  constructor(private readonly cicdService: CicdService) {}

  @Get(':projectId/events')
  async getCICDEvents(@Param('projectId') projectId: string) {
    return this.cicdService.getCICDEventsForProject(projectId);
  }

  @Get('workflow/:projectId/runs')
  async getWorkflowRuns(@Param('projectId') projectId: string) {
    return this.cicdService.getWorkflowRuns(projectId);
  }

  @Post('workflow/:projectId/trigger')
  async triggerWorkflow(
    @Param('projectId') projectId: string,
    @Query('workflowName') workflowName: string,
    @Query('ref') ref: string,
  ) {
    return this.cicdService.triggerWorkflow(projectId, workflowName, ref);
  }

  @Post('workflow/:projectId/rerun/:workflowRunId')
  async rerunWorkflow(
    @Param('projectId') projectId: string,
    @Param('workflowRunId') workflowRunId: number,
  ) {
    return this.cicdService.rerunWorkflow(projectId, workflowRunId);
  }

  @Post('workflow/:projectId/cancel/:workflowRunId')
  async cancelWorkflow(
    @Param('projectId') projectId: string,
    @Param('workflowRunId') workflowRunId: number,
  ) {
    return this.cicdService.cancelWorkflow(projectId, workflowRunId);
  }

  @Get('workflow/:projectId/run-logs/:workflowRunId')
  async downloadWorkflowLogs(
    @Param('projectId') projectId: string,
    @Param('workflowRunId') workflowRunId: number,
  ): Promise<{ message: string; logs: LogEntry[] }> {
    return this.cicdService.downloadWorkflowLogs(projectId, workflowRunId);
  }

  @Get('workflow/:projectId/artifacts/:workflowRunId')
  async getWorkflowArtifacts(
    @Param('projectId') projectId: string,
    @Param('workflowRunId') workflowRunId: number,
  ) {
    return this.cicdService.getWorkflowArtifacts(projectId, workflowRunId);
  }
}
