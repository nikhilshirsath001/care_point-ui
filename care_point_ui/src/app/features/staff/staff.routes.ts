import { Routes } from '@angular/router';

export const STAFF_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/staff-list/staff-list.component')
        .then(m => m.StaffListComponent)
  },

  // /main/staff/schedule
  {
    path: 'schedule',
    loadComponent: () =>
      import('./pages/staff-schedule/staff-schedule.component')
        .then(m => m.StaffScheduleComponent)
  },

  // /main/staff/availability
  {
    path: 'availability',
    loadComponent: () =>
      import('./pages/staff-availability/staff-availability.component')
        .then(m => m.StaffAvailabilityComponent)
  }

];
