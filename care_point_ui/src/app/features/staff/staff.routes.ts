import { Routes } from '@angular/router';

export const STAFF_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/staff-list/staff-list.component')
        .then(m => m.StaffListComponent)
  },

  // /main/staff/create
  {
    path: 'create',
    loadComponent: () =>
      import('./pages/staff-create/staff-create.component')
        .then(m => m.StaffCreateComponent)
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
  },

  // /main/staff/:id
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/staff-details/staff-details.component')
        .then(m => m.StaffDetailsComponent)
  },

  // /main/staff/:id/edit
  {
    path: ':id/edit',
    loadComponent: () =>
      import('./pages/staff-edit/staff-edit.component')
        .then(m => m.StaffEditComponent)
  }

];
