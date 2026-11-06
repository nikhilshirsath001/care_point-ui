import { Routes } from '@angular/router';

export const IPD_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/inpatient-list/inpatient-list.component')
        .then(m => m.InpatientListComponent)
  },
  {
    path: 'admission',
    loadComponent: () =>
      import('./pages/admission/admission.component')
        .then(m => m.AdmissionComponent)
  },
  {
    path: 'treatment',
    loadComponent: () =>
      import('./pages/treatment-progress/treatment-progress.component')
        .then(m => m.TreatmentProgressComponent)
  },
  {
    path: 'discharge',
    loadComponent: () =>
      import('./pages/discharge/discharge.component')
        .then(m => m.DischargeComponent)
  },
  {
    path: 'discharge-list',
    loadComponent: () =>
      import('./pages/discharge-list/discharge-list.component')
        .then(m => m.DischargeListComponent)
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/inpatient-details/inpatient-details.component')
        .then(m => m.InpatientDetailsComponent)
  }
];
