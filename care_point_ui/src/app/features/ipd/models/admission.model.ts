export interface Admission {

    patientId:number;

    admissionDate:Date;

    admissionType:string;

    status:string;

    reason:string;

    admittingDoctorId: number;
}


export interface BedAssignment {
  admissionId: number;
  patientId: number;
  bedId: number;
}