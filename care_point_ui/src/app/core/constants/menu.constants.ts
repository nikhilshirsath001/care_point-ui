import { MenuItem } from 'primeng/api';

export const MENU_ITEMS: MenuItem[] = [
  {
    label: 'Home',
    icon: 'pi pi-home',
    routerLink: ['/main'],
  },

  // Patient Management
  {
    label: 'Patients',
    icon: 'pi pi-users',
    items: [
      {
        label: 'Patient List',
        icon: 'pi pi-list',
        routerLink: ['/main/patient'],
        permission: 'PATIENT_READ',
      },
      {
        label: 'Patient Registration',
        icon: 'pi pi-user-plus',
        routerLink: ['/main/patient/create'],
        permission: 'PATIENT_CREATE',
      },
    ],
  },

//Visits
  {
  label: 'Visits',
  icon: 'pi pi-calendar',
  routerLink: '/main/visits',
  permission: 'VISIT_READ',
},

  // Doctor & Staff Management
  {
    label: 'Doctors & Staff',
    icon: 'pi pi-id-card',
    items: [
      {
        label: 'Staff List',
        icon: 'pi pi-users',
        routerLink: ['/main/staff'],
        permission: 'STAFF_READ',
      },
      // {
      //   label: 'Duty Schedule',
      //   icon: 'pi pi-calendar',
      //   routerLink: ['/main/staff/schedule']
      // },
      // {
      //   label: 'Availability',
      //   icon: 'pi pi-clock',
      //   routerLink: ['/main/staff/availability']
      // }
    ],
  },

  // IPD Management
  {
    label: 'IPD / Inpatients',
    icon: 'pi pi-building',
    items: [
      {
        label: 'Inpatient List',
        icon: 'pi pi-list',
        routerLink: ['/main/ipd'],
        permission: 'ADMISSION_READ',
      },
      {
        label: 'Admission',
        icon: 'pi pi-sign-in',
        routerLink: ['/main/ipd/admission'],
        permission: 'ADMISSION_CREATE',
      },
      {
        label: 'Treatment & Prescriptions',
        icon: 'pi pi-chart-line',
        routerLink: ['/main/ipd/treatment'],
        permission: 'PATIENT_TREATMENT_READ',
      },
      {
        label: 'Discharge',
        icon: 'pi pi-sign-out',
        routerLink: ['/main/ipd/discharge'],
        permission: 'DISCHARGE_READ',
      },
    ],
  },

  // Bed & Ward Management
  {
    label: 'Bed & Ward',
    icon: 'pi pi-th-large',
    items: [
      {
        label: 'Wards & Rooms',
        icon: 'pi pi-building',
        routerLink: ['/main/bed-ward/wards'],
        permission: 'WARD_READ',
      },
      {
        label: 'Bed Management',
        icon: 'pi pi-table',
        routerLink: ['/main/bed-ward/beds'],
        permission: 'BED_READ',
      },
      {
        label: 'Bed Allocation',
        icon: 'pi pi-map-marker',
        routerLink: ['/main/bed-ward/allocation'],
        permission: 'BED_ASSIGNMENT_READ',
      },
    ],
  },

  // EMR
  {
    label: 'EMR',
    icon: 'pi pi-file-edit',
    items: [
      {
        label: 'Clinical Records',
        icon: 'pi pi-folder-open',
        routerLink: ['/main/emr'],
        permission: 'MEDICAL_RECORD_READ',
      },
      {
        label: 'Medical History',
        icon: 'pi pi-history',
        routerLink: ['/main/emr/history'],
        permission: 'MEDICAL_RECORD_READ',
      },
      {
        label: 'Diagnosis',
        icon: 'pi pi-heart',
        routerLink: ['/main/emr/diagnosis'],
        permission: 'DIAGNOSIS_READ',
      },
      {
        label: 'Medications & Treatment',
        icon: 'pi pi-plus-circle',
        routerLink: ['/main/emr/treatment'],
        permission: 'PATIENT_TREATMENT_READ',
      },
      {
        label: 'Investigations',
        icon: 'pi pi-search',
        routerLink: ['/main/emr/investigations'],
        permission: 'MEDICAL_RECORD_READ',
      },
    ],
  },

  // Billing
  {
    label: 'Billing',
    icon: 'pi pi-wallet',
    items: [
      {
        label: 'Billing List',
        icon: 'pi pi-list',
        routerLink: ['/main/billing'],
        permission: 'BILL_READ',
      },
      {
        label: 'Create Bill',
        icon: 'pi pi-file-plus',
        routerLink: ['/main/billing/create'],
        permission: 'BILL_CREATE',
      },
      {
        label: 'Payments & Receipts',
        icon: 'pi pi-credit-card',
        routerLink: ['/main/billing/payments'],
        permission: 'PAYMENT_READ',
      },
      {
        label: 'Refunds & Adjustments',
        icon: 'pi pi-refresh',
        routerLink: ['/main/billing/refunds'],
        permission: 'PAYMENT_READ',
      },
      {
        label: 'Billing History',
        icon: 'pi pi-history',
        routerLink: ['/main/billing/history'],
        permission: 'BILL_READ',
      },
    ],
  },

  // Patient Documents
  {
    label: 'Patient Documents',
    icon: 'pi pi-folder',
    items: [
      {
        label: 'Documents',
        icon: 'pi pi-file',
        routerLink: ['/main/patient/documents'],
        permission: 'DOCUMENT_READ',
      },
    ],
  },
  //medications
  {
    label: 'Medications',
    icon: 'pi pi-folder',
    items: [
      {
        label: 'Medications',
        icon: 'pi pi-file',
        routerLink: ['/main/medication'],
        permission: 'MEDICATION_READ',
      },
      //   {
      //   label: 'Prescriptions',
      //   icon: 'pi pi-file',
      //   routerLink: ['/main/medication/prescription'],
      // },
    ],
  },
  // Administration
  {
    label: 'Administration',
    icon: 'pi pi-cog',
    items: [
      {
        label: 'Departments',
        icon: 'pi pi-building',
        routerLink: ['/main/administrator/department'],
        permission: 'DEPARTMENT_READ',
      },

      {
        label: 'Procedures',
        icon: 'pi pi-list-check',
        routerLink: ['/main/administrator/procedure'],
        permission: 'PROCEDURE_READ',
      },

      {
        label: 'Diagnosis',
        icon: 'pi pi-heart',
        routerLink: ['/main/administrator/diagnosis'],
        permission: 'DIAGNOSIS_READ',
      },

      {
        label: 'Service',
        icon: 'pi pi-briefcase',
        routerLink: ['/main/administrator/service'],
        permission: 'SERVICE_READ',
      },

      {
        label: 'Users',
        icon: 'pi pi-user',
        routerLink: ['/main/administrator/user'],
        permission: 'USER_READ',
      },

      // {
      //   label: 'Roles',
      //   icon: 'pi pi-users',
      //   routerLink: ['/main/administrator/roles'],
      // },

      {
        label: 'Permissions',
        icon: 'pi pi-lock',
        routerLink: ['/main/administrator/permissions'],
        permission: 'PERMISSION_READ',
      },
    ],
  },

  // Reports
  {
    label: 'Reports & Analytics',
    icon: 'pi pi-chart-bar',
    items: [
      {
        label: 'Dashboard',
        icon: 'pi pi-chart-pie',
        routerLink: ['/main/reports'],
      },
      {
        label: 'Patient Reports',
        icon: 'pi pi-users',
        routerLink: ['/main/reports/patients'],
      },
      {
        label: 'IPD & Bed Reports',
        icon: 'pi pi-building',
        routerLink: ['/main/reports/ipd'],
      },
      {
        label: 'Billing Reports',
        icon: 'pi pi-wallet',
        routerLink: ['/main/reports/billing'],
      },
      {
        label: 'Operational Reports',
        icon: 'pi pi-file',
        routerLink: ['/main/reports/operations'],
      },
    ],
  },
];