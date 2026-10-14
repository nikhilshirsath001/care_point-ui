import { TableColumn } from "../../../../shared/shared-table/shared-table.component";

export const PATIENT_COLUMNS: TableColumn[]= [

  {
    field: '__index',
    header: 'S.No',
    type: 'number',
    width: '80px',
    exportable: false
  },

  {
    field: 'abhaId',
    header: 'ABHA ID',
    sortable: true
  },

  {
    field: 'firstName',
    header: 'First Name',
    sortable: true
  },

  {
    field: 'lastName',
    header: 'Last Name',
    sortable: true
  },

  {
    field: 'dateOfBirth',
    header: 'Date of Birth',
    type: 'date',
    sortable: true
  },

  {
    field: 'gender',
    header: 'Gender',
    sortable: true
  },

  {
    field: 'bloodGroup',
    header: 'Blood Group',
    sortable: true
  },

  {
    field: 'phone',
    header: 'Phone',
    sortable: true
  },

  {
    field: 'email',
    header: 'Email',
    sortable: true
  },

  {
    field: 'address',
    header: 'Address',
    sortable: true
  },

  {
    field: 'city',
    header: 'City',
    sortable: true
  },

  {
    field: 'state',
    header: 'State',
    sortable: true
  },

  {
    field: 'pincode',
    header: 'Pincode',
    sortable: true
  },

  {
    field: 'emergencyContactName',
    header: 'Emergency Contact',
    sortable: true
  },

  {
    field: 'emergencyContactPhone',
    header: 'Emergency Phone',
    sortable: true
  },

  {
    field: 'actions',
    header: 'Actions',
    type: 'action',
    width: '150px'
  }

];
