import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
import * as clerk from '@clerk/clerk-sdk-node';
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
      const clerkUser = await clerk.verifyToken(token, { });

      if (!clerkUser) {
        throw new UnauthorizedException('Invalid token');
      }

      const { emailAddresses, firstName, lastName } = clerkUser;

      // Check if the user exists in the database
      let user = await this.usersService.findByEmail(
        emailAddresses[0].emailAddress,
      );

      // If the user does not exist, create a new user
      if (!user) {
        user = await this.usersService.createUser({
          email: emailAddresses[0].emailAddress,
          name: `${firstName} ${lastName}`,
        });
      }

      // Return the user, which will be attached to the request object
      return user;
    } catch (error) {
      throw new UnauthorizedException('Authentication failed');
    }
  }
}
