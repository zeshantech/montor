// backend/src/users/users.controller.ts

import {
    Controller,
    Post,
    Body,
    HttpException,
    HttpStatus,
    Get,
    UseGuards,
    Req,
  } from '@nestjs/common';
  import { UsersService } from './users.service';
  import { CreateUserDto } from './dto/create-user.dto';
  import { User } from './user.entity';
  import { AuthGuard } from '@nestjs/passport';
  import { RolesGuard } from '../auth/roles.guard';
  import { Roles } from '../auth/roles.decorator';
  import { UserRole } from './user.entity';
  
  @Controller('users')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  export class UsersController {
    constructor(private readonly usersService: UsersService) {}
  
    // Registration endpoint (Public)
    @Post('register')
    async register(
      @Body() createUserDto: CreateUserDto,
    ): Promise<User> {
      const existingUser = await this.usersService.findByEmail(createUserDto.email);
      if (existingUser) {
        throw new HttpException('Email already in use', HttpStatus.BAD_REQUEST);
      }
      const user = await this.usersService.create(createUserDto);
      return user;
    }
  
    // Profile endpoint (Protected)
    @Get('profile')
    @Roles(UserRole.ADMIN, UserRole.USER)
    async getProfile(@Req() req): Promise<User> {
      return req.user;
    }
  
    // Admin-only endpoint (Example)
    @Get('admin-only')
    @Roles(UserRole.ADMIN)
    async adminOnly(@Req() req) {
      return { message: 'This is an admin-only route.' };
    }
  }
  