import { SharedTableConfig, TableColumn } from "../../../shared/shared-table/shared-table.component";


export const PROCEDURE_COLUMNS: TableColumn[] = [

  {
    field: 'procedureCode',
    header: 'procedure Code',
    sortable: true
  },

  {
    field: 'procedureName',
    header: 'procedure Name',
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