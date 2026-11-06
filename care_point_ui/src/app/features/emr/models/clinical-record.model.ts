export interface ClinicalRecord {
  medicalRecordId?: number;
  patientId: number;
  visitId?: number;
  doctorId?: number;
  diagnosisId?: number;
  recordDate?: string;
  symptoms?: string;
  treatment?: string;
  notes?: string;
}

export interface CreateClinicalRecordRequest {
  patientId: number;
  visitId?: number;
  doctorId?: number;
  diagnosisId?: number;
  recordDate?: string;
  symptoms?: string;
  treatment?: string;
  notes?: string;
}