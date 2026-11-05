import { TableColumn } from '../../../../shared/shared-table/shared-table.component';

export const PATIENT_COLUMNS: TableColumn[] = [
  // {
  //   field: '__index',
  //   header: 'S.No',
  //   type: 'number',
  //   width: '80px',
  //   exportable: false
  // },

  {
    field: 'patientMrNumber',
    header: 'MR Number',
    sortable: true,
  },

  {
    field: 'patientName',
    header: 'Patient Name',
    sortable: true,
  },

  {
    field: 'gender',
    header: 'Gender',
    sortable: true,
  },

  {
    field: 'patientDob',
    header: 'Date of Birth',
    type: 'date',
    sortable: true,
  },

  {
    field: 'patientMob',
    header: 'Mobile Number',
    sortable: true,
  },

  {
    field: 'abhaNumber',
    header: 'ABHA Number',
    sortable: true,
  },

  // {
  //   field: 'bloodGroup',
  //   header: 'Blood Group',
  //   sortable: true,
  // },
// 
  // {
  //   field: 'email',
  //   header: 'Email',
  //   sortable: true,
  // },

  // {
  //   field: 'address',
  //   header: 'Address',
  //   sortable: true,
  // },

  // {
  //   field: 'city',
  //   header: 'City',
  //   sortable: true,
  // },

  // {
  //   field: 'state',
  //   header: 'State',
  //   sortable: true,
  // },

  // {
  //   field: 'pincode',
  //   header: 'Pincode',
  //   sortable: true,
  // },

  // {
  //   field: 'emergencyContactName',
  //   header: 'Emergency Contact',
  //   sortable: true,
  // },

  {
    field: 'contactPerson.mobileNumber',
    header: 'Contact Person Mobile',
    // sortable: true,
  },

  {
    field: 'actions',
    header: 'Actions',
    type: 'action',
    width: '150px',
  },
];
