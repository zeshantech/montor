// backend/src/monitoring/monitoring.controller.ts

import { Controller, Get, UseGuards } from '@nestjs/common';
import { MonitoringService } from './monitoring.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/user.entity';

@Controller('monitoring')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class MonitoringController {
  constructor(private readonly monitoringService: MonitoringService) {}

  // Get current system metrics
  @Get('system')
  @Roles(UserRole.ADMIN, UserRole.USER)
  getSystemMetrics() {
    return this.monitoringService.getSystemMetrics();
  }
}
