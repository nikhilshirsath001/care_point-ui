import { inject } from '@angular/core';
import { CanActivateChildFn, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';

export const permissionGuard: CanActivateChildFn = (childRoute, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.ensureLoaded().pipe(
    map(loggedIn => {
      if (!loggedIn) {
        return router.createUrlTree(['/login']);
      }
      const required = childRoute.data?.['permission'] as string | string[] | undefined;
      const allowed = required
        ? authService.hasAnyPermission(Array.isArray(required) ? required : [required])
        : authService.hasPermissionForUrl(state.url);
      return allowed ? true : router.createUrlTree(['/main']);
    })
  );
};