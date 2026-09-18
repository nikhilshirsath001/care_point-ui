import { MenuItem } from "primeng/api";

export const MENU_ITEMS : MenuItem[] = [

  {
    label: 'Home',
    icon: 'pi pi-home',
    routerLink: '/'
  },

  {
    label: 'Policy',
    icon: 'pi pi-shield',
    routerLink: ['/policy', 'create-policy']

  },

  {
    label: 'Patient',
    icon: 'pi pi-users',
    routerLink: ['/patient', 'create-patient']

    // items: [
    //   {
    //     label: 'Create Patient',
    //     icon: 'pi pi-user-plus',
    //     routerLink: ['/patient', 'create-patient']
    //   },
    //   {
    //     label: 'Create Diagnosis',
    //     icon: 'pi pi-heart',
    //     routerLink: ['/patient', 'create-diagnosis']
    //   },
    //   {
    //     label: 'Create Procedure',
    //     icon: 'pi pi-list-check',
    //     routerLink: ['/patient', 'create-procedure']
    //   }
    // ]
  },

  {
    label: 'Eligibility',
    icon: 'pi pi-check-circle',
    routerLink: ['/eligiblity', 'create-eligiblity']
  },

  {
    label: 'Pre Auth',
    icon: 'pi pi-file-check',
    routerLink: ['/pre-auth', 'create-pre-auth']
  },


  {
    label: 'Billing',
    icon: 'pi pi-wallet',
    routerLink: ['/billing', 'create-bill']
  },

  {
    label: 'Users',
    icon: 'pi pi-users',
    routerLink: ['/user', 'create-user']
  },
  {
    label: 'doctors',
    icon: 'pi pi-users',
    routerLink: ['/user', 'create-user']
  }

];