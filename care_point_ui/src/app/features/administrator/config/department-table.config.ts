import { SharedTableConfig, TableColumn } from "../../../shared/shared-table/shared-table.component";


export const DEPARTMENT_COLUMNS: TableColumn[] = [

  {
    field: 'departmentCode',
    header: 'Department Code',
    sortable: true
  },

  {
    field: 'departmentName',
    header: 'Department Name',
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
    emptyMessage: 'No patients found'
  };