import { Injectable } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { API_ENDPOINTS } from '../../../core/constants/api-endpoints';
import { HttpParams } from '@angular/common/http';

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

  getPrescriptionsByAdmissionId(admissionId: any){
        return this.apiService.getObservable(`${API_ENDPOINTS.MEDICATION.PRESCRIPTION.PATIENT_PRESCRIPTION}/${admissionId}`);
  }

  searchAdmissions(keyword: string, page: number = 0) {
    // const params = new HttpParams().set('keyword', keyword.trim());
    const params = new HttpParams()
      .set('active', 'true')
      .set('keyword', keyword.trim())
      .set('page', page.toString() || '0')
      .set('size', 100);
    return this.apiService.getObservable(API_ENDPOINTS.IPD.SEARCH, params);
  }
}
