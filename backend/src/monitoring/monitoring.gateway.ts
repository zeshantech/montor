// backend/src/monitoring/monitoring.gateway.ts

import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MonitoringService } from './monitoring.service';
import { Logger, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({
  cors: {
    origin: '*', // Adjust as needed for security
  },
})
@Injectable()
export class MonitoringGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('MonitoringGateway');

  constructor(
    private readonly monitoringService: MonitoringService,
    private readonly jwtService: JwtService,
  ) {}

  afterInit(server: Server) {
    this.logger.log('WebSocket server initialized');
    // Start emitting metrics at intervals
    setInterval(() => {
      const metrics = this.monitoringService.getSystemMetrics();
      this.server.emit('systemMetrics', metrics);
    }, 5000); // every 5 seconds
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);

    // Optionally, authenticate the client
    const token = client.handshake.auth.token;
    if (token) {
      try {
        const payload = this.jwtService.verify(token, {
          secret: process.env.JWT_SECRET,
        });
        client.data.user = payload;
        this.logger.log(`Client authenticated: ${client.id}`);
      } catch (error) {
        this.logger.warn(`Client authentication failed: ${client.id}`);
        client.disconnect();
      }
    } else {
      this.logger.warn(`No token provided by client: ${client.id}`);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }
}
