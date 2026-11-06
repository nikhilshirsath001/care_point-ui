
export interface Discharge {
  dischargeId?: number;
  admissionId: number;
  doctorId?: number | null;
  dischargeDate: string;
  dischargeType: string;
  dischargeSummary: string;
  createdAt?: string;
}

export interface CreateDischargeRequest {
  admissionId: number;
  doctorId: number | null;
  dischargeDate: string;
  dischargeType: string;
  dischargeSummary: string;
}