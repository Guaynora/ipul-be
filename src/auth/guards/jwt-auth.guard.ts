import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { Request } from 'express';
import { AuthService } from '../auth.service';

type AuthenticatedRequest = Request & {
  user?: Awaited<ReturnType<AuthService['verifyAccessToken']>>;
};

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = this.getRequest(context);
    if (!request) {
      throw new UnauthorizedException();
    }

    const authorizationHeader = request.headers.authorization;
    const authHeader =
      typeof authorizationHeader === 'string' ? authorizationHeader : undefined;
    const token = authHeader?.startsWith('Bearer ')
      ? authHeader.slice(7)
      : undefined;
    if (!token) {
      throw new UnauthorizedException();
    }

    const payload = await this.authService.verifyAccessToken(token);
    request.user = payload;
    return true;
  }

  private getRequest(context: ExecutionContext): AuthenticatedRequest | undefined {
    if (context.getType<GqlContextType>() === 'graphql') {
      const ctx = GqlExecutionContext.create(context);
      return ctx.getContext<{ req: AuthenticatedRequest }>().req;
    }
    return context.switchToHttp().getRequest<AuthenticatedRequest>();
  }
}
