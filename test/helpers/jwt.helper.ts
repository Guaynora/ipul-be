import { sign } from 'jsonwebtoken';

export function buildAdminToken(): string {
  return sign(
    { sub: 'admin@ipul.local', email: 'admin@ipul.local', role: 'ADMIN', tokenType: 'access' },
    'dev-jwt-secret',
    { expiresIn: '15m' },
  );
}
