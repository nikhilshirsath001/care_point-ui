  export interface Visit {
    visitId: number;
    patientId: number;
    patientName?: string;

    
    doctorEmployeeNo?: string;
    doctorFirstName?: string;
    doctorLastName?: string;

    departmentId?: number;
    departmentCode?: string;
    departmentName?: string;

    visitType: string;
    visitDate?: string;
    reason?: string;
    status: string;

    diagnosisId?: number;
    diagnosisName?: string;

    createdAt?: string;
    updatedAt?: string;
  }

  export interface VisitRequest {
    patientId: number;
    doctorId?: number;
    departmentId?: number;
    diagnosisId?: number;
    visitType: string;
    visitDate?: string;
    reason?: string;
  }