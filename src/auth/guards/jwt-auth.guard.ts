import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from '../auth.service';

type AuthenticatedRequest = Request & {
  user?: Awaited<ReturnType<AuthService['verifyAccessToken']>>;
};

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const authorizationHeader = request.headers.authorization;
    const authHeader =
      typeof authorizationHeader === 'string' ? authorizationHeader : undefined;
    const token = authHeader?.startsWith('Bearer ')
      ? authHeader.slice(7)
      : undefined;
    if (!token) {
      return false;
    }

    const payload = await this.authService.verifyAccessToken(token);
    request.user = payload;
    return true;
  }
}
