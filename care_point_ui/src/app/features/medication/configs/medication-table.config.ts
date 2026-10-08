import {
  SharedTableConfig,
  TableColumn,
} from '../../../shared/shared-table/shared-table.component';

export const MEDICATION_COLUMNS: TableColumn[] = [
  {
    field: 'medicationId',
    header: 'Sr No',
    sortable: true,
  },
  {
    field: 'name',
    header: 'Medication Name',
    sortable: true,
  },

  {
    field: 'genericName',
    header: 'Generic Name',
    sortable: true,
  },

  {
    field: 'strength',
    header: 'Strength',
    sortable: true,
  },
  {
    field: 'actions',
    header: 'Actions',
    type: 'action',
  },
];

export const MEDICATION_TABLE_CONFIG: SharedTableConfig = {
  searchable: true,

  paginator: true,

  rows: 10,

  rowsPerPageOptions: [10, 20, 50, 100],

  exportable: true,

  showRefresh: true,

  loading: false,

  emptyMessage: 'No medications found',

  canCreateNewRecord: true,

  canUploadDocuments: false,

  canViewDocuments: false,
};
