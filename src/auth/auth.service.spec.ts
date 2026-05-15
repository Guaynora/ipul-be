import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  const jwtSecret = 'test-secret';
  const adminEmail = 'admin@ipul.local';
  const adminPassword = 'super-secret';

  let service: AuthService;

  beforeEach(() => {
    service = new AuthService({
      jwtSecret,
      accessTtl: '15m',
      refreshTtl: '7d',
      adminEmail,
      adminPassword,
    });
  });

  it('issues access and refresh tokens for valid admin credentials', async () => {
    const result = await service.login({
      email: adminEmail,
      password: adminPassword,
    });

    expect(result.accessToken).toBeDefined();
    expect(result.refreshToken).toBeDefined();
  });

  it('rejects invalid credentials', async () => {
    await expect(
      service.login({ email: adminEmail, password: 'wrong' }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('verifies a valid access token and returns ADMIN principal', async () => {
    const login = await service.login({
      email: adminEmail,
      password: adminPassword,
    });

    const payload = await service.verifyAccessToken(login.accessToken);

    expect(payload.role).toBe('ADMIN');
    expect(payload.email).toBe(adminEmail);
  });
});
