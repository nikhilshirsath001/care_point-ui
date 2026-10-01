import {
  SharedTableConfig,
  TableColumn
} from '../../../shared/shared-table/shared-table.component';

export const SERVICE_COLUMNS: TableColumn[] = [

  {
    field: 'serviceCode',
    header: 'Service Code',
    sortable: true
  },

  {
    field: 'serviceName',
    header: 'Service Name',
    sortable: true
  },

  {
    field: 'serviceCategory.categoryName',
    header: 'Category',
    sortable: true
  },

  {
    field: 'defaultPrice',
    header: 'Default Price',
    type: 'number',
    sortable: true
  },

  {
    field: 'actions',
    header: 'Actions',
    type: 'action',
    width: '150px'
  }

];

export const TABLE_CONFIG: SharedTableConfig = {

  searchable: true,

  paginator: true,

  rows: 10,

  rowsPerPageOptions: [10, 25, 50],

  exportable: true,

  showRefresh: true,

  loading: false,

  emptyMessage: 'No services found'

};