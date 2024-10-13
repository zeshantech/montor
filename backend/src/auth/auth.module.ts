// backend/src/auth/auth.module.ts

import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { ClerkStrategy } from './clerk.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    ConfigModule,
  ],
  providers: [ClerkStrategy],
})
export class AuthModule {}
