import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout/main-layout.component';
import { LoginComponent } from './auth/login/page/login/login.component';

export const routes: Routes = [
  {

    path:'',
    component:LoginComponent,
    pathMatch:'full' } ,

    {
    path: 'login',
    component: LoginComponent,
  },

  {
    path:'main',
    component: MainLayoutComponent,
    
  }, 

  
];
