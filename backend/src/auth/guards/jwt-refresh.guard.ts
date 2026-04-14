import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtRefreshGuard extends AuthGuard('jwt-refresh') {
  handleRequest<TUser = unknown>(err: Error | null, user: TUser | false, info: Error | undefined): TUser {
    if (err || !user) {
      throw err || new UnauthorizedException(info?.message ?? 'Invalid refresh token');
    }
    return user;
  }
}
