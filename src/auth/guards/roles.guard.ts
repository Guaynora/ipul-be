import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';

type AuthorizedUser = { role?: string };
type UserRequest = Request & { user?: AuthorizedUser };

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly roles: string[]) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<UserRequest>();
    const user = request.user;

    if (!user?.role) {
      return false;
    }

    return this.roles.includes(user.role);
  }
}
