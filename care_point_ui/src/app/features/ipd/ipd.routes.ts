import { Routes } from '@angular/router';

export const IPD_ROUTES: Routes = [

  // /main/ipd
  {
    path: '',
    loadComponent: () =>
      import('./pages/inpatient-list/inpatient-list.component')
        .then(m => m.InpatientListComponent)
  },

  // /main/ipd/admission
  {
    path: 'admission',
    loadComponent: () =>
      import('./pages/admission/admission.component')
        .then(m => m.AdmissionComponent)
  },

  // /main/ipd/treatment
  {
    path: 'treatment',
    loadComponent: () =>
      import('./pages/treatment-progress/treatment-progress.component')
        .then(m => m.TreatmentProgressComponent)
  },

  // /main/ipd/discharge
  {
    path: 'discharge',
    loadComponent: () =>
      import('./pages/discharge/discharge.component')
        .then(m => m.DischargeComponent)
  },

  // /main/ipd/:id
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/inpatient-details/inpatient-details.component')
        .then(m => m.InpatientDetailsComponent)
  }

];