export interface PatientDocument {
  id: number | string;
  fileName: string;
  fileSize?: number;
  fileType?: string;
  documentId: number;
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
  status?: string;
  progress?: number;
  file?: File;
  [key: string]: any;
}

export interface PatientInfo {
  id: number;
  patientId?: number;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  gender?: string;
  dateOfBirth?: string;
  age?: number;
  bloodGroup?: string;
  mobile?: string;
  phone?: string;
  abhaId: number;
}