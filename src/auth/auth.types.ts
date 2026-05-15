export type AdminRole = 'ADMIN';

export interface AuthConfig {
  jwtSecret: string;
  accessTtl: string;
  refreshTtl: string;
  adminEmail: string;
  adminPassword: string;
}

export interface AuthTokenPayload {
  sub: string;
  email: string;
  role: AdminRole;
  tokenType: 'access' | 'refresh';
}
