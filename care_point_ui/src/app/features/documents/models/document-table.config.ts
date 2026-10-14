import { TableColumn } from "../../../shared/shared-table/shared-table.component";

export const VISIT_COLUMNS: TableColumn[] = [
  {
    field: 'doctorEmployeeNo',
    header: 'Doctor Employee No',
    sortable: true
  },
  {
    field: 'doctorFirstName',
    header: 'Doctor Name',
    sortable: true
  },
//   {
//     field: 'doctorLastName',
//     header: 'Doctor Last Name',
//     sortable: true
//   },
  {
    field: 'departmentName',
    header: 'Department',
    sortable: true
  },
  {
    field: 'visitType',
    header: 'Visit Type',
    sortable: true
  },
  {
    field: 'visitDate',
    header: 'Visit Date',
    sortable: true
  },
  {
    field: 'reason',
    header: 'Reason',
    sortable: true
  },
  {
    field: 'status',
    header: 'Status',
    sortable: true
  },
//   {
//     field: 'actions',
//     header: 'Actions',
//     type: 'action',
//     width: '150px'
//   }
];

export const ADMISSION_COLUMNS: TableColumn[] = [
//   {
//     field: 'admissionId',
//     header: 'Admission ID',
//     sortable: true
//   },
  {
    field: 'admissionNumber',
    header: 'Admission Number',
    sortable: true
  },
  {
    field: 'patientName',
    header: 'Patient Name',
    sortable: true
  },
  {
    field: 'admittingDoctorName',
    header: 'Admitting Doctor',
    sortable: true
  },
  {
    field: 'admissionDate',
    header: 'Admission Date',
    sortable: true
  },
  {
    field: 'admissionType',
    header: 'Admission Type',
    sortable: true
  },
  {
    field: 'status',
    header: 'Status',
    sortable: true
  },
  {
    field: 'reason',
    header: 'Reason',
    sortable: true
  },
  {
    field: 'actions',
    header: 'Actions',
    type: 'action',
    width: '150px'
  }
];