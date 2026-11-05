import { Routes } from '@angular/router';
import { PatientDocumentManagementComponent } from '../documents/components/patient-document-management/patient-document-management.component';
import { PatientDocumentUploadComponent } from '../documents/components/patient-document-upload/patient-document-upload.component';

export const PATIENT_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/patient-list/patient-list.component')
        .then(m => m.PatientListComponent)
  },

  {
    path: 'create',
    loadComponent: () =>
      import('./pages/patient-registration/patient-registration.component')
        .then(m => m.PatientRegistrationComponent)
  },
  
  {
    path: 'documents',
    loadComponent: () => PatientDocumentManagementComponent
  },  

//   {
//     path: ':id/edit',
//     loadComponent: () =>
//       import('./pages/patient-edit/patient-edit.component')
//         .then(m => m.PatientEditComponent)
//   }
];
