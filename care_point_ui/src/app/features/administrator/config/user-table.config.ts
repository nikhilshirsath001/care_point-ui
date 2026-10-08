import {
  TableColumn,
  SharedTableConfig,
} from '../../../shared/shared-table/shared-table.component';

export const USER_COLUMNS: TableColumn[] = [
  {
    field: 'userId',
    header: 'User ID',
    sortable: true,
  },

  {
    field: 'username',
    header: 'Username',
    sortable: true,
  },

  {
    field: 'employeeNo',
    header: 'Employee No',
    sortable: true,
  },
  {
    field: 'firstName',
    header: 'First Name',
    sortable: true,
  },
  {
    field: 'lastName',
    header: 'Last Name',
    sortable: true,
  },

  {
    field: 'actions',
    header: 'Actions',
    type: 'action',
  },
];

export const USER_TABLE_CONFIG: SharedTableConfig = {
  searchable: true,

  paginator: true,

  rows: 10,

  rowsPerPageOptions: [10, 20, 50, 100],

  exportable: true,

  showRefresh: true,

  loading: false,

  emptyMessage: 'No medications found',

  canCreateNewRecord: false,

  canUploadDocuments: false,

  canViewDocuments: false,
};
