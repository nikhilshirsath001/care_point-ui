import { Routes } from '@angular/router';
import { CreateBillComponent } from '../pages/create-bill/create-bill.component';
import { BillListComponent } from '../component/bill-list/bill-list.component';

export const BILLING_ROUTES: Routes = [

  {
    path: 'create',
    component: CreateBillComponent,
     data: {
      permission: 'BILL_CREATE',
    },
  },

  {
    path:'list',
    component:BillListComponent,
     data: {
      permission: 'BILL_CREATE',
    },
  } ,
];  