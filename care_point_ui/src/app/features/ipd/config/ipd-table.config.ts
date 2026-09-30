import {
  SharedTableConfig,
  TableColumn
} from '../../../shared/shared-table/shared-table.component';


export const INPATIENT_COLUMNS: TableColumn[] = [

  {
    field: 'admissionNumber',
    header: 'Admission No',
    sortable: true
  },

  {
    field: 'patientName',
    header: 'Patient Name',
    sortable: true
  },

  {
    field: 'patientId',
    header: 'Patient No',
    sortable: true
  },

  {
    field: 'ward',
    header: 'Ward',
    sortable: true
  },

  {
    field: 'bed',
    header: 'Bed',
    sortable: true
  },

  {
    field: 'admittingDoctorName',
    header: 'Attending Doctor',
    sortable: true
  },

  {
    field: 'admissionDate',
    header: 'Admission Date',
    type: 'date',
    sortable: true
  },

  {
    field: 'status',
    header: 'Status',
    type: 'status',
    sortable: true
  },

  {
    field: 'actions',
    header: 'Actions',
    type: 'action',
    width: '150px'
  }

];


export const INPATIENT_TABLE_CONFIG: SharedTableConfig = {

  searchable: true,

  paginator: true,

  rows: 10,

  rowsPerPageOptions: [10, 25, 50],

  exportable: true,

  showRefresh: true,

  loading: false,

  emptyMessage: 'No inpatient records found'

};