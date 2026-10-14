export interface PatientDocument {
  id: number | string;

  fileName: string;
  fileSize?: number;
  fileType?: string;

  documentType: string;

  patientId?: number;
  visitId?: number | null;
  admissionId?: number | null;

  uploadedBy?: number;

  verified?: boolean;
  sensitive?: boolean;

  uploadedAt?: string;
  createdAt?: string;
  uploadDate?: string;

  /**
   * Available only if your API returns a downloadable/previewable File.
   */
  file?: File;

  [key: string]: any;
}

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