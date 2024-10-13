// backend/src/monitoring/monitoring.controller.ts

import { Controller, Get, UseGuards } from '@nestjs/common';
import { MonitoringService } from './monitoring.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('monitoring')
@UseGuards(AuthGuard)
export class MonitoringController {
  constructor(private readonly monitoringService: MonitoringService) {}

  @Get('system')
  getSystemMetrics() {
    return this.monitoringService.getSystemMetrics();
  }
}
