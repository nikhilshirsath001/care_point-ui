
import { DetailField } from '../../../shared/shared-details/shared-details.component';
import { SharedTableConfig, TableColumn } from '../../../shared/shared-table/shared-table.component';

export const ROOM_COLUMNS: TableColumn[] = [
  { field: 'roomNumber', header: 'Room Number' },
  { field: 'wardId', header: 'Ward ID' },
  { field: 'roomType', header: 'Room Type' },
  { field: 'status', header: 'Status' },
  { field: 'actions', header: 'Actions',type:'action' },
];

export const ROOM_DETAILS_FIELDS: DetailField[] = [
  { field: 'roomId', label: 'Room ID' },
  { field: 'roomNumber', label: 'Room Number' },
  { field: 'wardId', label: 'Ward ID' },
  { field: 'roomType', label: 'Room Type' },
  { field: 'status', label: 'Status' },
];
  
export  let  ROOM_TABLE_CONFIG: SharedTableConfig = {
  searchable: true,
  paginator: true,
  rows: 10,
  rowsPerPageOptions: [10, 20, 50, 100],
  exportable: true,
  showRefresh: true,
  loading: false,
  emptyMessage: 'No Room found',
  canCreateNewRecord: true,
  canUploadDocuments: false,
  canViewDocuments: false,
  };
