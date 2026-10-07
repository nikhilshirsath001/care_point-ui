export type DocumentStatus =
  | 'pending'
  | 'uploading'
  | 'uploaded'
  | 'failed';

export interface DocumentItem {
  id: string;
  documentId?: string | number;
  file: File;
  fileName: string;
  fileSize: number;
  fileType: string;
  documentType: string;
  status: DocumentStatus;
  progress: number;
  serverId?: string | number;
  errorMessage?: string;
}

export interface DocumentTypeOption {
  label: string;
  value: string;
}
