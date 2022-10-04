import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Response } from 'express';
import { Observable, tap } from 'rxjs';

@Injectable()
export class TokensInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      tap((data) => {
        if (context.getType() === 'http') {
          const http = context.switchToHttp();
          const res: Response = http.getResponse();

          const { access_token, refresh_token } = data;
          res.cookie('jwt', access_token, {
            httpOnly: true,
            domain: 'localhost',
            path: '/',
            secure: false,
            sameSite: 'lax',
          });

          res.cookie('jwt-refresh', refresh_token, {
            httpOnly: true,
            domain: 'localhost',
            path: '/',
            secure: false,
            sameSite: 'lax',
          });
        }
      }),
    );
  }
}
