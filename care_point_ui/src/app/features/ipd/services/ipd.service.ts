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
}
