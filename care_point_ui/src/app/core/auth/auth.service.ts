import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import {
  catchError,
  finalize,
  map,
  shareReplay,
  switchMap,
  tap,
} from 'rxjs/operators';
import { ApiService } from '../services/api.service';

export interface CurrentUser {
  username: string;
  roles: string[]; // e.g. DOCTOR
  permissions: string[]; // e.g. PATIENT_READ
}

/**
 * Route prefix -> permission needed to open that part of the app.
 * More specific prefix first. This only controls what the UI shows;
 * the server enforces the same permissions on every API call.
 */
const ROUTE_PERMISSIONS: ReadonlyArray<{ prefix: string; permission: string }> =
  [
    { prefix: '/main/patient/documents', permission: 'DOCUMENT_READ' },
    { prefix: '/main/patient/create', permission: 'PATIENT_CREATE' },
    { prefix: '/main/patient', permission: 'PATIENT_READ' },
    { prefix: '/main/visits', permission: 'VISIT_READ' },
    { prefix: '/main/staff', permission: 'STAFF_READ' },
    { prefix: '/main/ipd/admission', permission: 'ADMISSION_CREATE' },
    { prefix: '/main/ipd/treatment', permission: 'PATIENT_TREATMENT_READ' },
    { prefix: '/main/ipd/discharge', permission: 'DISCHARGE_READ' },
    { prefix: '/main/ipd', permission: 'ADMISSION_READ' },
    { prefix: '/main/bed-ward/wards', permission: 'WARD_READ' },
    { prefix: '/main/bed-ward/allocation', permission: 'BED_ASSIGNMENT_READ' },
    { prefix: '/main/bed-ward', permission: 'BED_READ' },
    { prefix: '/main/emr/diagnosis', permission: 'DIAGNOSIS_READ' },
    { prefix: '/main/emr', permission: 'MEDICAL_RECORD_READ' },
    { prefix: '/main/billing/create', permission: 'BILL_CREATE' },
    { prefix: '/main/billing/payments', permission: 'PAYMENT_READ' },
    { prefix: '/main/billing/refunds', permission: 'PAYMENT_READ' },
    { prefix: '/main/billing', permission: 'BILL_READ' },
    { prefix: '/main/medication', permission: 'MEDICATION_READ' },
    { prefix: '/main/administrator/department', permission: 'DEPARTMENT_READ' },
    { prefix: '/main/administrator/procedure', permission: 'PROCEDURE_READ' },
    { prefix: '/main/administrator/diagnosis', permission: 'DIAGNOSIS_READ' },
    { prefix: '/main/administrator/service', permission: 'SERVICE_READ' },
    { prefix: '/main/administrator/user', permission: 'USER_READ' },
    {
      prefix: '/main/administrator/permissions',
      permission: 'PERMISSION_READ',
    },
  ];
const LEGACY_STORAGE_KEYS = [
  'user_roles',
  'user_role',
  'user_permissions',
  'access_token',
];

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = inject(ApiService);

  // In memory only. Tokens are HttpOnly cookies; roles/permissions are re-read from /auth/me on page load.
  private readonly _user = signal<CurrentUser | null>(null);
  readonly user = this._user.asReadonly();
  readonly isLoggedIn = computed(() => this._user() !== null);

  private readonly permissionSet = computed(
    () => new Set(this._user()?.permissions ?? []),
  );
  private readonly roleSet = computed(() => new Set(this._user()?.roles ?? []));

  private meRequest$: Observable<boolean> | null = null;

  constructor() {
    // Remove values older builds kept in localStorage
    try {
      LEGACY_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
    } catch {
      /* storage unavailable */
    }
  }

  // ---------------------------------------------------------------- session

  login(data: { username: string; password: string }): Observable<any> {
    return this.api
      .postObservable('/auth/login', data)
      .pipe(tap((res: any) => this.applySession(res)));
  }

  /** Rotates the refresh cookie and returns a fresh access cookie. */
  // refresh(): Observable<any> {
  //   return this.api.postObservable('/auth/refresh', null).pipe(
  //     tap((res: any) => this.applySession(res))
  //   );
  // }
  refresh(): Observable<any> {
    return this.api.postObservable('/auth/refresh', null).pipe(
      tap((res: any) => {
        if (!this.applySession(res)) {
          throw new Error('Refresh failed');
        }
      }),
      catchError((error) => {
        this.clearUserAccess();
        return throwError(() => error);
      }),
    );
  }

  /** Makes sure the user is known after a page reload. Concurrent callers share one /auth/me call. */
  ensureLoaded(): Observable<boolean> {
  if (this._user()) {
    return of(true);
  }

  if (!this.meRequest$) {
    this.meRequest$ = this.api.getObservable('/auth/me').pipe(
      map((res: any) => this.applySession(res)),

      catchError(() => {
        // First /auth/me failed. Try refresh.
        return this.api.postObservable('/auth/refresh', null).pipe(
          switchMap((refreshRes: any) => {
            // Refresh endpoint succeeded.
            // Now fetch the user again.
            return this.api.getObservable('/auth/me');
          }),

          map((res: any) => this.applySession(res)),

          catchError(() => {
            this.clearUserAccess();
            return of(false);
          }),
        );
      }),

      finalize(() => {
        this.meRequest$ = null;
      }),

      shareReplay({ bufferSize: 1, refCount: false }),
    );
  }

  return this.meRequest$;
}

  logout(): Observable<any> {
    return this.api.postObservable('/auth/logout', null).pipe(
      finalize(() => this.clearUserAccess()), // clear locally even if the call fails
    );
  }

  clearUserAccess(): void {
    this._user.set(null);
  }

  // private applySession(res: any): boolean {
  //   const data = res?.data;
  //   if (res?.status !== 1 || !data) {
  //     return false;
  //   }
  //   this._user.set({
  //     username: data.username ?? '',
  //     roles: (data.roles ?? []).map((r: string) => r.toUpperCase()),
  //     permissions: (data.permissions ?? []).map((p: string) => p.toUpperCase()),
  //   });
  //   return true;
  // }
  private applySession(res: any): boolean {
    const data = res?.data;

    if (res?.status !== 1 || !data) {
      this.clearUserAccess();
      return false;
    }

    this._user.set({
      username: data.username ?? '',
      roles: Array.isArray(data.roles)
        ? data.roles
            .filter((role: unknown): role is string => typeof role === 'string')
            .map((role: string) => role.toUpperCase())
        : [],
      permissions: Array.isArray(data.permissions)
        ? data.permissions
            .filter(
              (permission: unknown): permission is string =>
                typeof permission === 'string',
            )
            .map((permission: string) => permission.toUpperCase())
        : [],
    });

    return true;
  }

  // ------------------------------------------------------------ permissions

  hasPermission(permission: string): boolean {
    return this.permissionSet().has(permission.toUpperCase());
  }

  hasAnyPermission(permissions: string[]): boolean {
    return permissions.some((p) => this.hasPermission(p));
  }

  hasAllPermissions(permissions: string[]): boolean {
    return permissions.every((p) => this.hasPermission(p));
  }

  hasRole(role: string): boolean {
    return this.roleSet().has(role.toUpperCase());
  }

  hasPermissionForUrl(url: string): boolean {
    const path = url.split('?')[0].split('#')[0].replace(/\/+$/, '') || '/';

    if (path === '/main') {
      return true;
    }

    const rule = ROUTE_PERMISSIONS.find(
      (item) => path === item.prefix || path.startsWith(item.prefix + '/'),
    );

    // Routes without an entry stay open in the UI (the API still enforces permissions).
    return rule ? this.hasPermission(rule.permission) : true;
  }

  // ------------------------------------------- compatibility with old callers

  getUserRoles(): string[] {
    return this._user()?.roles ?? [];
  }

  getUserRole(): string | null {
    return this._user()?.roles[0] ?? null;
  }

  getUserPermissions(): string[] {
    return this._user()?.permissions ?? [];
  }
}
