// backend/src/auth/auth.controller.ts

import {
    Controller,
    Post,
    Body,
    UnauthorizedException,
  } from '@nestjs/common';
  import { AuthService } from './auth.service';
  import { UsersService } from '../users/users.service';
  import { LoginDto } from './dto/login.dto';
  
  @Controller('auth')
  export class AuthController {
    constructor(
      private authService: AuthService,
      private usersService: UsersService,
    ) {}
  
    // Login endpoint
    @Post('login')
    async login(@Body() loginDto: LoginDto) {
      const user = await this.authService.validateUser(
        loginDto.email,
        loginDto.password,
      );
      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }
      return this.authService.login(user);
    }
  }
  