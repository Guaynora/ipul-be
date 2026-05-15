import { Injectable, UnauthorizedException } from '@nestjs/common';
import { sign, verify, type Secret, type SignOptions } from 'jsonwebtoken';
import type { AuthConfig, AuthTokenPayload } from './auth.types';

@Injectable()
export class AuthService {
  constructor(private readonly config: AuthConfig = defaultAuthConfig()) {}

  login(credentials: { email: string; password: string }): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    if (
      credentials.email !== this.config.adminEmail ||
      credentials.password !== this.config.adminPassword
    ) {
      return Promise.reject(new UnauthorizedException('Bad credentials'));
    }

    return Promise.resolve({
      accessToken: this.signToken(
        credentials.email,
        'access',
        this.config.accessTtl,
      ),
      refreshToken: this.signToken(
        credentials.email,
        'refresh',
        this.config.refreshTtl,
      ),
    });
  }

  refresh(refreshToken: string): Promise<{ accessToken: string }> {
    const payload = this.verifyToken(refreshToken, 'refresh');
    return Promise.resolve({
      accessToken: this.signToken(
        payload.email,
        'access',
        this.config.accessTtl,
      ),
    });
  }

  verifyAccessToken(token: string): Promise<AuthTokenPayload> {
    return Promise.resolve(this.verifyToken(token, 'access'));
  }

  private signToken(
    email: string,
    tokenType: 'access' | 'refresh',
    expiresIn: string,
  ): string {
    const options: SignOptions = {
      expiresIn: expiresIn as SignOptions['expiresIn'],
    };

    return sign(
      {
        sub: email,
        email,
        role: 'ADMIN',
        tokenType,
      },
      this.config.jwtSecret as Secret,
      options,
    );
  }

  private verifyToken(
    token: string,
    expectedType: 'access' | 'refresh',
  ): AuthTokenPayload {
    try {
      const decoded = verify(token, this.config.jwtSecret) as AuthTokenPayload;
      if (decoded.tokenType !== expectedType) {
        throw new UnauthorizedException('Invalid token type');
      }
      return decoded;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}

function defaultAuthConfig(): AuthConfig {
  return {
    jwtSecret: process.env.JWT_SECRET ?? 'dev-jwt-secret',
    accessTtl: process.env.JWT_ACCESS_TTL ?? '15m',
    refreshTtl: process.env.JWT_REFRESH_TTL ?? '7d',
    adminEmail: process.env.ADMIN_EMAIL ?? 'admin@ipul.local',
    adminPassword: process.env.ADMIN_PASSWORD ?? 'admin123',
  };
}
