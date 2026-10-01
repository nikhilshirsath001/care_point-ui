import { SharedTableConfig, TableColumn } from "../../../shared/shared-table/shared-table.component";


export const DIAGNOSIS_COLUMNS: TableColumn[] = [

  {
    field: 'diagnosisCode',
    header: 'diagnosis Code',
    sortable: true
  },

  {
    field: 'diagnosisName',
    header: 'diagnosis Name',
    sortable: true
  },

  {
    field: 'description',
    header: 'Description',
    sortable: true
  },

//   {
//     field: 'active',
//     header: 'Status',
//     type: 'status',
//     sortable: true
//   },
  {
    field: 'actions',
    header: 'Actions',
    type: 'action',
    width: '150px'
  }

];
  
export  let  TABLE_CONFIG: SharedTableConfig = {
    searchable: true,
    paginator: true,
    rows: 10,
    rowsPerPageOptions: [10, 25, 50],
    exportable: true,
    showRefresh: true,
    loading: false,
    emptyMessage: 'No Diagnosis found'
  };