// backend/src/monitoring/monitoring.module.ts

import { Module } from '@nestjs/common';
import { MonitoringService } from './monitoring.service';
import { MonitoringController } from './monitoring.controller';
import { MonitoringGateway } from './monitoring.gateway';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [JwtModule, ConfigModule],
  providers: [MonitoringService, MonitoringGateway],
  controllers: [MonitoringController],
})
export class MonitoringModule {}
