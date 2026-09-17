import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(

    catchError((error: HttpErrorResponse) => {

      switch (error.status) {

        case 400:
          console.error('Bad Request:', error);
          break;

        case 401:
          console.error('Unauthorized:', error);

          // Session expired / token invalid
          router.navigate(['/login']);
          break;

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
    })

  );
};
