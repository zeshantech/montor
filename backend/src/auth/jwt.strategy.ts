// backend/src/auth/jwt.strategy.ts

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, // Ensure token is not expired
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  // Validate JWT payload and attach user to request
  async validate(payload: any): Promise<User> {
    const user = await this.usersService.findById(payload.sub);
    if (!user) {
      return null;
    }

    return user;
  }
}
