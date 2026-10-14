import { DetailField } from '../../../shared/shared-details/shared-details.component';
import {
  SharedTableConfig,
  TableColumn,
} from '../../../shared/shared-table/shared-table.component';

export const FLOOR_COLUMNS: TableColumn[] = [
  { field: 'floorNumber', header: 'Floor No.' },
  { field: 'floorName', header: 'Floor Name' },
  { field: 'description', header: 'Description' },
  { field: 'active', header: 'Status' },
  { field: 'actions', header: 'Actions',type:'action' },
];

export const FLOOR_DETAILS_FIELDS: DetailField[] = [
  { field: 'floorId', label: 'Floor ID' },
  { field: 'floorNumber', label: 'Floor Number' },
  { field: 'floorName', label: 'Floor Name' },
  { field: 'description', label: 'Description' },
  { field: 'active', label: 'Status', type: 'status' },
];

export let FLOOR_TABLE_CONFIG: SharedTableConfig = {
  searchable: true,
  paginator: true,
  rows: 10,
  rowsPerPageOptions: [10, 20, 50, 100],
  exportable: true,
  showRefresh: true,
  loading: false,
  emptyMessage: 'No Floor found',
  canCreateNewRecord: true,
  canUploadDocuments: false,
  canViewDocuments: false,
};
