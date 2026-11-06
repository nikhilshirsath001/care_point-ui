export interface Medication {
  medicationId: number;
  name: string;
  genericName?: string;
  strength?: string;
}

export interface PrescriptionItem {
  prescriptionItemId: number;
  medicationId: number;
  medicationName: string;
  genericName?: string;
  strength?: string;
  dosage?: string;
  frequency?: string;
  duration?: string;
  instructions?: string;
}

export interface Prescription {
  prescriptionId: number;
  patientId: number;
  visitId?: number;
  doctorId?: number;
  prescriptionDate: string;
  notes?: string;
  active: boolean;
  createdAt?: string;
  items: PrescriptionItem[];
}