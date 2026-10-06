import { Injectable } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { API_ENDPOINTS } from '../../../core/constants/api-endpoints';

@Injectable({
  providedIn: 'root',
})
export class IpdService {
  constructor(private apiService: ApiService) {}

  getAllInPatients() {
    return this.apiService.getObservable(API_ENDPOINTS.IPD.GET_ALL);
  }

  createAdmission(createAdmissionObj: any) {
    return this.apiService.postObservable(
      API_ENDPOINTS.IPD.CREATE,
      createAdmissionObj,
    );
  }

  getTreatmentWorkspace(patientId: any) {
    return this.apiService.getObservable(
      `${API_ENDPOINTS.IPD.GET_PATEINT_WORKSPACE_BY_PATIENT_ID}${patientId}/workspace`,
    );
  }

  getAllTreatmentsByAdmissionId(admissionId: any) {
    return this.apiService.getObservable(
      `${API_ENDPOINTS.IPD.GET_TREATMENTS_BY_ADMISSION_ID}/${admissionId}`,
    );
  }

  createTreatment(createTreatmentObj: any) {
    return this.apiService.postObservable(
      API_ENDPOINTS.IPD.CREATE_TREATMENT,
      createTreatmentObj,
    );
  }

  createPrescription(createPrescriptionObj: any) {
    return this.apiService.postObservable(
      API_ENDPOINTS.IPD.CREATE_PRESCRIPTION,
      createPrescriptionObj,
    );
  }

  getAllMedications() {
    return this.apiService.getObservable(API_ENDPOINTS.MEDICATION.GET_ALL);
  }

  getPrescriptionsByPatientId(patientId: any){
        return this.apiService.getObservable(`${API_ENDPOINTS.MEDICATION.PRESCRIPTION.PATIENT_PRESCRIPTION}/${patientId}`);

  }
}
