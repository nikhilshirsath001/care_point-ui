import { Routes } from '@angular/router';

export const EMR_ROUTES: Routes = [
{
path: '',
loadComponent: () =>
import('../components/patient-emr-header/patient-emr-header.component')
.then(m => m.PatientEmrHeaderComponent)
},
{
path: 'patient/:patientId',
loadComponent: () =>
import('../pages/emr/emr.component')
.then(m => m.EmrComponent)
},



];
