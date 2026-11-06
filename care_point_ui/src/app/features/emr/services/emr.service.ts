// import { Injectable } from '@angular/core';
// import { ApiService } from '../../../core/services/api.service';
// import { Observable } from 'rxjs';
// import { Diagnosis } from '../models/diagnosis.model';


// @Injectable({
//   providedIn: 'root'
// })
// export class EmrService {

  
 
//   constructor(private apiService: ApiService) {}

//   getPatientByAbhaId(abhaId: string): Observable<any> {
//     return this.apiService.getObservable(
//       `/hmis/get-abha-id?abhaId=${encodeURIComponent(abhaId)}`
//     );
//   }

//   getPatientById(patientId: number): Observable<any> {
//     return this.apiService.getObservable(
//       `/hmis/get-patient-id?patientId=${patientId}`
//     );
//   }

//   getMedicalRecordsByPatient(
//   patientId: number,
//   page: number = 0,
//   size: number = 20
// ): Observable<any> {
//   return this.apiService.getObservable(
//     `/medical-records?patientId=${patientId}&page=${page}&size=${size}`
//   );
// }
// createMedicalRecord(request: any): Observable<any> {
//   return this.apiService.postObservable(
//     `/medical-records`,
//     request
//   );
// }


// getProceduresByPatient(patientId: number): Observable<any> {
//   return this.apiService.getObservable(
//     `/procedure/patient/${patientId}`
//   );
// }


// getDiagnosesByPatient(patientId: number): Observable<any> {
//   return this.apiService.getObservable(
//     `/medical-records/patient/${patientId}/diagnoses`
//   );
// }

// getPrescriptionsByPatient(patientId: number): Observable<any> {
//   return this.apiService.getObservable(
//     `/medication/prescription/patient/${patientId}`
//   );
// }

// getMedications(): Observable<any> {
//   return this.apiService.getObservable(
//     `/medication/medications`
//   );
// }

// getStaffById(staffId: number): Observable<any> {
//   return this.apiService.getObservable(`/staff/${staffId}`);
// }

// getDiagnosisById(diagnosisId: number): Observable<any> {
//   return this.apiService.getObservable(`/diagnosis/${diagnosisId}`);
// }
// }


import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from '../../../core/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class EmrService {

  constructor(
    private apiService: ApiService
  ) {}


  // =========================================================
  // PATIENT
  // =========================================================

  getPatientByAbhaId(
    abhaId: string
  ): Observable<any> {

    return this.apiService.getObservable(
      `/hmis/get-abha-id?abhaId=${encodeURIComponent(abhaId)}`
    );
  }


  // =========================================================
  // MEDICAL RECORD / CLINICAL RECORD
  // =========================================================

getMedicalRecords(page: number = 0, size: number = 1000): Observable<any> {
  return this.apiService.getObservable(
    `/medical-records?page=${page}&size=${size}`
  );
}


  getMedicalRecordsByPatient(
    patientId: number
  ): Observable<any> {

    return this.apiService.getObservable(
      `/medical-records?patientId=${patientId}`
    );
  }


  createMedicalRecord(
    request: any
  ): Observable<any> {

    return this.apiService.postObservable(
      '/medical-records',
      request
    );
  }


  // =========================================================
  // DIAGNOSIS
  // =========================================================

  getDiagnosesByPatient(
    patientId: number
  ): Observable<any> {

    return this.apiService.getObservable(
      `/medical-records/patient/${patientId}/diagnoses`
    );
  }


  getDiagnosisById(
    diagnosisId: number
  ): Observable<any> {

    return this.apiService.getObservable(
      `/diagnosis/${diagnosisId}`
    );
  }


  // =========================================================
  // PROCEDURES
  // =========================================================

  getProceduresByPatient(
    patientId: number
  ): Observable<any> {

    return this.apiService.getObservable(
      `/procedure/patient/${patientId}`
    );
  }


  // =========================================================
  // MEDICATIONS
  // =========================================================

  getPrescriptionsByPatient(
    patientId: number
  ): Observable<any> {

    return this.apiService.getObservable(
      `/medication/prescription/patient/${patientId}`
    );
  }


  getMedications(): Observable<any> {

    return this.apiService.getObservable(
      `/medication/medications`
    );
  }


  // =========================================================
  // STAFF
  // =========================================================

  getStaffById(
    staffId: number
  ): Observable<any> {

    return this.apiService.getObservable(
      `/staff/${staffId}`
    );
  }


  // =========================================================
  // VISITS
  // =========================================================


  getPatientById(patientId: number): Observable<any> {
  return this.apiService.getObservable(
    `/hmis/get-patient-id?patientId=${patientId}`
  );
}
  getVisits(): Observable<any> {

    return this.apiService.getObservable(
      '/visits'
    );
  }
}