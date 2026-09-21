import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout/main-layout.component';
import { LoginComponent } from './auth/login/page/login/login.component';
import { MainDashboardComponent } from './features/dashborad/pages/main-dashboard/main-dashboard.component';

export const routes: Routes = [

  // Login
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  {
    path: 'login',
    component: LoginComponent
  },

  // Main application layout
  {
    path: 'main',
    component: MainLayoutComponent,

    children: [

      // Dashboard / Home
      {
        path: '',
        component:MainDashboardComponent
      },

      // Patient module
      {
        path: 'patient',
        loadChildren: () =>
          import('./features/patient/patient.routes')
            .then(m => m.PATIENT_ROUTES)
      },

      // Staff module
      {
        path: 'staff',
        loadChildren: () =>
          import('./features/staff/staff.routes')
            .then(m => m.STAFF_ROUTES)
      },

      // Ipd module
      {
        path: 'ipd',
        loadChildren: () =>
          import('./features/ipd/ipd.routes')
            .then(m => m.IPD_ROUTES)
      },

      // Ipd module
      {
        path: 'bed-ward',
        loadChildren: () =>
          import('./features/bed-ward/bed-ward.routes')
            .then(m => m.BED_WARD_ROUTES)
      },

      // Add other modules here
      // {
      //   path: 'billing',
      //   loadChildren: () =>
      //     import('./features/billing/billing.routes')
      //       .then(m => m.BILLING_ROUTES)
      // }

    ]
  }

];
