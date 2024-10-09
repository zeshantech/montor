// backend/src/webhooks/webhooks.controller.ts

import {
    Controller,
    Post,
    Req,
    Headers,
    Body,
    HttpCode,
    HttpStatus,
  } from '@nestjs/common';
  import { WebhooksService } from './webhooks.service';
  import { Request } from 'express';
  
  @Controller('webhooks')
  export class WebhooksController {
    constructor(private readonly webhooksService: WebhooksService) {}
  
    // GitHub webhook endpoint
    @Post('github')
    @HttpCode(HttpStatus.NO_CONTENT)
    async handleGitHubWebhook(
      @Headers() headers,
      @Body() body: any,
      @Req() req: Request,
    ) {
      try {
        await this.webhooksService.handleGitHubWebhook(headers, body);
      } catch (error) {
        // Optionally, log the error
        // Re-throw the error to return appropriate HTTP status
        throw error;
      }
    }
  }
  