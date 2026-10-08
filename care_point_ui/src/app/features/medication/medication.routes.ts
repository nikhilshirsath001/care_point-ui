import { Routes } from '@angular/router';

export const MEDICATION_ROUTES: Routes = [

  {
    path: '',
    loadComponent: () =>
      import('./pages/medication-list/medication-list.component')
        .then(m => m.MedicationListComponent)
  },


];