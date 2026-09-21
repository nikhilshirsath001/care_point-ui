import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout/main-layout.component';
import { LoginComponent } from './auth/login/page/login/login.component';
import { DashboardComponent } from './shared/dashboard/dashboard.component';
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
