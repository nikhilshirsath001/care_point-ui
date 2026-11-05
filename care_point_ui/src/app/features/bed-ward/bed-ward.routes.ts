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
      import('./pages/bed-list/bed-list.component')
        .then(m => m.BedListComponent)
  },

  {
    path: 'allocation',
    loadComponent: () =>
      import('./pages/infrastructure-management/infrastructure-management.component')
        .then(m => m.InfrastructureManagementComponent)
  },

  // {
  //   path: 'allocation',
  //   loadComponent: () =>
  //     import('./pages/allocation/allocation.component')
  //       .then(m => m.AllocationComponent)
  // }

];