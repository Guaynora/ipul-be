import {
  ArgumentsHost,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { HttpExceptionFilter } from './http-exception.filter';

describe('HttpExceptionFilter', () => {
  it('maps unauthorized exceptions to a structured payload', () => {
    const filter = new HttpExceptionFilter();
    const statusSpy = jest.fn().mockReturnThis();
    const jsonSpy = jest.fn();
    const host = {
      getType: () => 'http',
      switchToHttp: () => ({
        getResponse: () => ({ status: statusSpy, json: jsonSpy }),
        getRequest: () => ({ url: '/auth/login' }),
      }),
    } as unknown as ArgumentsHost;

    filter.catch(new UnauthorizedException('Bad credentials'), host);

    expect(statusSpy).toHaveBeenCalledWith(HttpStatus.UNAUTHORIZED);
    expect(jsonSpy).toHaveBeenCalledWith({
      statusCode: HttpStatus.UNAUTHORIZED,
      message: 'Bad credentials',
      path: '/auth/login',
    });
  });
});
