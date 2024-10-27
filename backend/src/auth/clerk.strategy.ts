import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
import { clerkClient, verifyToken } from '@clerk/clerk-sdk-node';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ClerkStrategy extends PassportStrategy(Strategy, 'clerk') {
  constructor(private readonly usersService: UsersService) {
    super();
  }

  async validate(req: Request): Promise<any> {
    try {
      const authorizationHeader = req.headers['authorization'];
      if (!authorizationHeader) {
        throw new UnauthorizedException('Authorization header is missing');
      }

      const token = authorizationHeader.split(' ')[1];
      const decodedToken = await verifyToken(token, {
        secretKey: process.env.CLERK_SECRET_KEY,
      });

      if (!decodedToken) {
        throw new UnauthorizedException('Invalid token');
      }

      const userId = decodedToken.sub;
      const clerkUser = await clerkClient.users.getUser(userId);

      let user = await this.usersService.findByEmail(
        clerkUser.emailAddresses[0].emailAddress,
      );

      if (!user) {
        user = await this.usersService.createUser({
          email: clerkUser.emailAddresses[0].emailAddress,
          name: `${clerkUser.firstName} ${clerkUser.lastName}`,
        });
      }

      return user;
    } catch (error: any) {
      throw new UnauthorizedException('Authentication failed');
    }
  }
}
