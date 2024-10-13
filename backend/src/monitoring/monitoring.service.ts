// backend/src/monitoring/monitoring.service.ts

import { Injectable } from '@nestjs/common';
import * as os from 'os';

@Injectable()
export class MonitoringService {
  // Retrieve current system metrics
  getSystemMetrics() {
    const metrics = {
      cpuLoad: this.getCpuLoad(),
      freeMemory: os.freemem(),
      totalMemory: os.totalmem(),
      usedMemory: os.totalmem() - os.freemem(),
      uptime: os.uptime(),
      diskUsage: this.getDiskUsage(),
      networkInterfaces: os.networkInterfaces(),
    };
    return metrics;
  }

  // Calculate CPU load average
  private getCpuLoad() {
    const cpus = os.cpus();
    const numCores = cpus.length;
    const loadAverages = os.loadavg(); // [1min, 5min, 15min]
    return {
      cores: numCores,
      loadAverages,
    };
  }

  // Placeholder for disk usage; requires additional modules or system commands
  private getDiskUsage() {
    // Disk usage calculation can be implemented using external packages or OS-specific commands
    // For simplicity, we'll return null or a dummy value
    return null;
  }
}
