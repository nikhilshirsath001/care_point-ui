import { Routes } from '@angular/router';

export const BED_WARD_ROUTES: Routes = [

  {
    path: 'wards',
    loadComponent: () =>
      import('./pages/wards/wards.component')
        .then(m => m.WardsComponent)
  },

  {
    path: 'beds',
    loadComponent: () =>
      import('./pages/beds/beds.component')
        .then(m => m.BedsComponent)
  },

  {
    path: 'allocation',
    loadComponent: () =>
      import('./pages/allocation/allocation.component')
        .then(m => m.AllocationComponent)
  }

];