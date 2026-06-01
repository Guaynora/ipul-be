import { ExecutionContext } from '@nestjs/common';
import { RolesGuard } from '../roles.guard';

function mockContext(user: unknown): ExecutionContext {
  return {
    switchToHttp: () => ({ getRequest: () => ({ user }) }),
  } as unknown as ExecutionContext;
}

describe('RolesGuard', () => {
  it('allows request when user role is ADMIN', () => {
    const guard = new RolesGuard(['ADMIN']);

    expect(guard.canActivate(mockContext({ role: 'ADMIN' }))).toBe(true);
  });

  it('rejects request when role is not allowed', () => {
    const guard = new RolesGuard(['ADMIN']);

    expect(guard.canActivate(mockContext({ role: 'USER' }))).toBe(false);
  });
});
