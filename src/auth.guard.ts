import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    if (!request.headers.authorization) {
      return false;
    }
    request.user = await this.validateToken(request.headers.authorization);
    // console.log(request.user.sub);
    return true;
  }

  async validateToken(auth: string) {
    if (auth.split(' ')[0] !== 'Bearer') {
      throw new Error('Invalid token');
    }
    const token = auth.split(' ')[1];
    try {
      const decoded = jwt.verify(token, 'secretKey');
      return decoded;
    } catch (err) {
      //   throw new Error('Token error: ' + err);
      throw new UnauthorizedException('Token Error', {
        cause: new Error(),
        description: err,
      });
    }
  }
}
