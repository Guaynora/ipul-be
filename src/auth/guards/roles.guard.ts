import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { Request } from 'express';

type AuthorizedUser = { role?: string };
type UserRequest = Request & { user?: AuthorizedUser };

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly roles: string[]) {}

  canActivate(context: ExecutionContext): boolean {
    const request = this.getRequest(context);
    const user = request?.user;

    if (!user?.role) {
      return false;
    }

    return this.roles.includes(user.role);
  }

  private getRequest(context: ExecutionContext): UserRequest | undefined {
    if (context.getType<GqlContextType>() === 'graphql') {
      const ctx = GqlExecutionContext.create(context);
      return ctx.getContext<{ req: UserRequest }>().req;
    }
    return context.switchToHttp().getRequest<UserRequest>();
  }
}
