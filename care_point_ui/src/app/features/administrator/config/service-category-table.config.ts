import { SharedTableConfig, TableColumn } from "../../../shared/shared-table/shared-table.component";


export const SERVICE_CATEGORY_COLUMNS: TableColumn[] = [

  {
    field: 'categoryName',
    header: 'Category Name',
    sortable: true
  },

  {
    field: 'description',
    header: 'Description',
    sortable: true
  },

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
    emptyMessage: 'No Service Category found'
  };