import { DetailField } from "../../../shared/shared-details/shared-details.component";
import { SharedTableConfig, TableColumn } from "../../../shared/shared-table/shared-table.component";


export const WARD_COLUMNS: TableColumn[] = [
  { field: 'wardName', header: 'Ward Name' },
  { field: 'departmentId', header: 'Department ID' },
  { field: 'floorId', header: 'Floor ID' },
  { field: 'wardType', header: 'Ward Type' },
  { field: 'active', header: 'Status' },
  { field: 'actions', header: 'Actions' ,type:'action'},
];

export const WARD_DETAILS_FIELDS: DetailField[] = [
  { field: 'wardId', label: 'Ward ID' },
  { field: 'wardName', label: 'Ward Name' },
  { field: 'departmentId', label: 'Department ID' },
  { field: 'floorId', label: 'Floor ID' },
  { field: 'wardType', label: 'Ward Type' },
  { field: 'active', label: 'Status', type: 'status' },
];

export  let  WARD_TABLE_CONFIG: SharedTableConfig = {
  searchable: true,
  paginator: true,
  rows: 10,
  rowsPerPageOptions: [10, 20, 50, 100],
  exportable: true,
  showRefresh: true,
  loading: false,
  emptyMessage: 'No Ward found',
  canCreateNewRecord: true,
  canUploadDocuments: false,
  canViewDocuments: false,
  };