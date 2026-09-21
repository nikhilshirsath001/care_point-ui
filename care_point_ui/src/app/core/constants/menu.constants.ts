import { MenuItem } from "primeng/api";

export const MENU_ITEMS : MenuItem[] = [

  {
    label: 'Home',
    icon: 'pi pi-home',
    routerLink: ['/main']
  },

  // Patient Management
  {
    label: 'Patients',
    icon: 'pi pi-users',
    items: [
      {
        label: 'Patient List',
        icon: 'pi pi-list',
        routerLink: ['/main/patient']
      },
      {
        label: 'Patient Registration',
        icon: 'pi pi-user-plus',
        routerLink: ['/main/patient/create']
      }
    ]
  },

  // Doctor & Staff Management
  {
    label: 'Doctors & Staff',
    icon: 'pi pi-id-card',
    items: [
      {
        label: 'Staff List',
        icon: 'pi pi-users',
        routerLink: ['/main/staff']
      },
      {
        label: 'Duty Schedule',
        icon: 'pi pi-calendar',
        routerLink: ['/main/staff/schedule']
      },
      {
        label: 'Availability',
        icon: 'pi pi-clock',
        routerLink: ['/main/staff/availability']
      }
    ]
  },

  // IPD Management
  {
    label: 'IPD / Inpatients',
    icon: 'pi pi-building',
    items: [
      {
        label: 'Inpatient List',
        icon: 'pi pi-list',
        routerLink: ['/main/ipd']
      },
      {
        label: 'Admission',
        icon: 'pi pi-sign-in',
        routerLink: ['/main/ipd/admission']
      },
      {
        label: 'Treatment & Progress',
        icon: 'pi pi-chart-line',
        routerLink: ['/main/ipd/treatment']
      },
      {
        label: 'Discharge',
        icon: 'pi pi-sign-out',
        routerLink: ['/main/ipd/discharge']
      }
    ]
  },

  // Bed & Ward Management
  {
    label: 'Bed & Ward',
    icon: 'pi pi-th-large',
    items: [
      {
        label: 'Wards & Rooms',
        icon: 'pi pi-building',
        routerLink: ['/main/bed-ward/wards']
      },
      {
        label: 'Bed Management',
        icon: 'pi pi-table',
        routerLink: ['/main/bed-ward/beds']
      },
      {
        label: 'Bed Allocation',
        icon: 'pi pi-map-marker',
        routerLink: ['/main/bed-ward/allocation']
      }
    ]
  },

  // EMR
  {
    label: 'EMR',
    icon: 'pi pi-file-edit',
    items: [
      {
        label: 'Clinical Records',
        icon: 'pi pi-folder-open',
        routerLink: ['/main/emr']
      },
      {
        label: 'Medical History',
        icon: 'pi pi-history',
        routerLink: ['/main/emr/history']
      },
      {
        label: 'Diagnosis',
        icon: 'pi pi-heart',
        routerLink: ['/main/emr/diagnosis']
      },
      {
        label: 'Medications & Treatment',
        icon: 'pi pi-plus-circle',
        routerLink: ['/main/emr/treatment']
      },
      {
        label: 'Investigations',
        icon: 'pi pi-search',
        routerLink: ['/main/emr/investigations']
      }
    ]
  },

  // Billing
  {
    label: 'Billing',
    icon: 'pi pi-wallet',
    items: [
      {
        label: 'Billing List',
        icon: 'pi pi-list',
        routerLink: ['/main/billing']
      },
      {
        label: 'Create Bill',
        icon: 'pi pi-file-plus',
        routerLink: ['/main/billing/create']
      },
      {
        label: 'Payments & Receipts',
        icon: 'pi pi-credit-card',
        routerLink: ['/main/billing/payments']
      },
      {
        label: 'Refunds & Adjustments',
        icon: 'pi pi-refresh',
        routerLink: ['/main/billing/refunds']
      },
      {
        label: 'Billing History',
        icon: 'pi pi-history',
        routerLink: ['/main/billing/history']
      }
    ]
  },

  // Patient Documents
  {
    label: 'Patient Documents',
    icon: 'pi pi-folder',
    items: [
      {
        label: 'Documents',
        icon: 'pi pi-file',
        routerLink: ['/main/documents']
      }
    ]
  },

  // Administration
  {
    label: 'Administration',
    icon: 'pi pi-cog',
    items: [
      {
        label: 'Users',
        icon: 'pi pi-user',
        routerLink: ['/main/admin/users']
      },
      {
        label: 'Roles',
        icon: 'pi pi-users',
        routerLink: ['/main/admin/roles']
      },
      {
        label: 'Permissions',
        icon: 'pi pi-lock',
        routerLink: ['/main/admin/permissions']
      }
    ]
  },

  // Reports
  {
    label: 'Reports & Analytics',
    icon: 'pi pi-chart-bar',
    items: [
      {
        label: 'Dashboard',
        icon: 'pi pi-chart-pie',
        routerLink: ['/main/reports']
      },
      {
        label: 'Patient Reports',
        icon: 'pi pi-users',
        routerLink: ['/main/reports/patients']
      },
      {
        label: 'IPD & Bed Reports',
        icon: 'pi pi-building',
        routerLink: ['/main/reports/ipd']
      },
      {
        label: 'Billing Reports',
        icon: 'pi pi-wallet',
        routerLink: ['/main/reports/billing']
      },
      {
        label: 'Operational Reports',
        icon: 'pi pi-file',
        routerLink: ['/main/reports/operations']
      }
    ]
  }

];
