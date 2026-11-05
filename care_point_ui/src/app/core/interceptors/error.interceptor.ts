import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../auth/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  // Do not refresh authentication endpoints themselves
  const authEndpoints = ['/auth/login', '/auth/refresh', '/auth/logout'];

  const isAuthEndpoint = authEndpoints.some((endpoint) =>
    req.url.includes(endpoint),
  );

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      switch (error.status) {
        case 400:
          console.error('Bad Request:', error);
          break;

        case 401: {
          console.error('Unauthorized:', error);

          // Avoid refresh loops on authentication endpoints
          if (isAuthEndpoint) {
            return throwError(() => error);
          }

          // Refresh session. Concurrent requests share the same refresh call.
          return authService.refresh().pipe(
            switchMap(() => {
              // Refresh succeeded. Retry original request.
              const retryRequest = req.clone({
                withCredentials: true,
              });

              return next(retryRequest).pipe(
                catchError((retryError: HttpErrorResponse) => {
                  if (retryError.status === 401) {
                    authService.clearUserAccess();
                    router.navigate(['/login']);
                  }

                  return throwError(() => retryError);
                }),
              );
            }),

            catchError((refreshError) => {
              // Refresh failed. Session is no longer valid.
              authService.clearUserAccess();

              router.navigate(['/login']);

              return throwError(() => refreshError);
            }),
          );
        }

        case 403:
          console.error('Forbidden:', error);
          break;

        case 404:
          console.error('Resource not found:', error);
          break;

        case 409:
          console.error('Conflict:', error);
          break;

        case 500:
          console.error('Internal Server Error:', error);
          break;

        default:
          console.error('HTTP Error:', error);
      }

      return throwError(() => error);
    }),
  );
};
