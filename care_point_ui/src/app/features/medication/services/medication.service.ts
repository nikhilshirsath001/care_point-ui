import { Injectable } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { API_ENDPOINTS } from '../../../core/constants/api-endpoints';

@Injectable({
  providedIn: 'root',
})
export class MedicationService {
  constructor(private apiService: ApiService) {}

  getAllMedications(currentPage: any, currentPageSize: any) {
    return this.apiService.getObservable(API_ENDPOINTS.MEDICATION.GET_ALL);
  }

  deleteMedication(medicationId: any) {
    return this.apiService.deleteObservable(
      `${API_ENDPOINTS.MEDICATION.DELETE}/${medicationId}`,
    );
  }

  createMedication(createMedicationObj: any) {
    return this.apiService.postObservable(
      API_ENDPOINTS.MEDICATION.CREATE,
      createMedicationObj,
    );
  }

  updateMedication(medicationId: number, editMedicationObj: any) {
    return this.apiService.putObservable(
      `${API_ENDPOINTS.MEDICATION.UPDATE}/${medicationId}`,
      editMedicationObj,
    );
  }
}
