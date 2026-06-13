import { ExecutionContext } from '@nestjs/common';
import { AuthService } from '../../auth.service';
import { JwtAuthGuard } from '../jwt-auth.guard';

function mockContext(request: Record<string, unknown>): ExecutionContext {
  return {
    getType: () => 'http',
    switchToHttp: () => ({ getRequest: () => request }),
  } as unknown as ExecutionContext;
}

describe('JwtAuthGuard', () => {
  it('allows request with valid bearer token and attaches user', async () => {
    const payload = {
      sub: 'admin@ipul.local',
      email: 'admin@ipul.local',
      role: 'ADMIN' as const,
      tokenType: 'access' as const,
    };
    const verifyAccessToken = jest.fn().mockResolvedValue(payload);
    const authService = {
      verifyAccessToken,
    } as unknown as AuthService;
    const request: Record<string, unknown> = {
      headers: { authorization: 'Bearer token-123' },
    };

    const guard = new JwtAuthGuard(authService);
    const allowed = await guard.canActivate(mockContext(request));

    expect(allowed).toBe(true);
    expect(verifyAccessToken).toHaveBeenCalledWith('token-123');
    expect(request.user).toEqual(payload);
  });
});
