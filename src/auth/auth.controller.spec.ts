import { Test } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  it('delegates login and returns issued tokens', async () => {
    const authService = {
      login: jest.fn().mockResolvedValue({
        accessToken: 'access',
        refreshToken: 'refresh',
      }),
    };
    const moduleRef = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: authService }],
    }).compile();

    const controller = moduleRef.get(AuthController);
    const result = await controller.login({
      email: 'admin@ipul.local',
      password: 'secret',
    });

    expect(authService.login).toHaveBeenCalledWith({
      email: 'admin@ipul.local',
      password: 'secret',
    });
    expect(result).toEqual({ accessToken: 'access', refreshToken: 'refresh' });
  });
});
