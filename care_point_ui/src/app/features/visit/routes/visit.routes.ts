import { Routes } from '@angular/router';

export const VISIT_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../pages/visit/visit.component')
        .then(m => m.VisitComponent)
  }
];