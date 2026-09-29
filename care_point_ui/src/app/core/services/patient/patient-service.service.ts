import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from '../../../core/services/api.service';
import { PatientModel } from '../../models/patient-model';
import { ApiResponse, PageResponse } from '../../models/api-response.model';
import { API_ENDPOINTS } from '../../constants/api-endpoints';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  private readonly apiService = inject(ApiService);

  public createPatient(patient: PatientModel): Observable<ApiResponse<PatientModel>> {
    
    return this.apiService.postObservable(API_ENDPOINTS.PATIENTS.CREATE,patient
    ) as Observable<ApiResponse<PatientModel>|any>;
  }

  public getAllPatients(page: number = 0,size: number = 20): Observable<ApiResponse<PageResponse<PatientModel>>> {
    
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.apiService.getObservable(API_ENDPOINTS.PATIENTS.GET_ALL, params) as Observable<ApiResponse<PageResponse<PatientModel>>>;
  }
}

