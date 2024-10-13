// backend/src/common/middleware/logging.middleware.ts

import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import axios from 'axios';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  private readonly logger = new Logger(LoggingMiddleware.name);
  private readonly newRelicLogEndpoint = 'https://log-api.newrelic.com/log/v1';
  private readonly newRelicInsertKey = process.env.NEW_RELIC_LOG_INSERT_KEY;

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl } = req;
    const userAgent = req.get('user-agent') || '';
    const ip = req.ip;

    res.on('finish', () => {
      const { statusCode } = res;
      const contentLength = res.get('content-length');

      const logMessage = `${method} ${originalUrl} ${statusCode} ${contentLength || 0} - ${userAgent} ${ip}`;
      this.logger.log(logMessage);

      this.sendLogToNewRelic('info', logMessage, {
        method,
        originalUrl,
        statusCode,
        contentLength,
        userAgent,
        ip,
      });
    });

    next();
  }

  private async sendLogToNewRelic(level: string, message: string, meta: any) {
    if (!this.newRelicInsertKey) {
      this.logger.warn('New Relic Insert Key not configured');
      return;
    }

    try {
      await axios.post(
        this.newRelicLogEndpoint,
        [
          {
            message,
            level,
            ...meta,
          },
        ],
        {
          headers: {
            'Content-Type': 'application/json',
            'Api-Key': this.newRelicInsertKey,
          },
        },
      );
    } catch (error) {
      this.logger.error('Failed to send log to New Relic:', error.message);
    }
  }
}
