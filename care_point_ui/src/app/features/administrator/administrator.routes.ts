import { Routes } from '@angular/router';

export const ADMINISTRATOR_ROUTES: Routes = [
  {
    path: 'department',
    loadComponent: () =>
      import('./pages/department/department.component').then(
        (m) => m.DepartmentComponent,
      ),
  },

  {
    path: 'procedure',
    loadComponent: () =>
      import('./pages/procedure/procedure.component').then(
        (m) => m.ProcedureComponent,
      ),
  },

  {
    path: 'diagnosis',
    loadComponent: () =>
      import('./pages/diagnosis/diagnosis.component').then(
        (m) => m.DiagnosisComponent,
      ),
  },

  {
    path: 'service',
    loadComponent: () =>
      import('./pages/service/service/service.component').then(
        (m) => m.ServiceComponent,
      ),
  },

  {
    path: 'user',
    loadComponent: () =>
      import('./pages/user/user.component').then((m) => m.UserComponent),
  },
  // {
  //   path: 'allocation',
  //   loadComponent: () =>
  //     import('./pages/allocation/allocation.component')
  //       .then(m => m.AllocationComponent)
  // }
];
