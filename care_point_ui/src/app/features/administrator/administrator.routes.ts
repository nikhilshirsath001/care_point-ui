import { Routes } from '@angular/router';

export const ADMINISTRATOR_ROUTES: Routes = [

  {
    path: 'department',
    loadComponent: () =>
      import('./pages/department/department.component')
        .then(m => m.DepartmentComponent)
  },

  // {
  //   path: 'beds',
  //   loadComponent: () =>
  //     import('./pages/beds/beds.component')
  //       .then(m => m.BedsComponent)
  // },

  // {
  //   path: 'allocation',
  //   loadComponent: () =>
  //     import('./pages/allocation/allocation.component')
  //       .then(m => m.AllocationComponent)
  // }

];