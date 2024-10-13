import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard as PAuthGuard } from '@nestjs/passport';

@Injectable()
export class AuthGuard extends PAuthGuard('clerk') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err, user, info, context) {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
