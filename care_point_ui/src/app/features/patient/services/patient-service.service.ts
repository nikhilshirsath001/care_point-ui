import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from '../../../core/services/api.service';
import { PatientModel } from '../models/patient-model';
import {
  ApiResponse,
  PageResponse,
} from '../../../core/models/api-response.model';
import { API_ENDPOINTS } from '../../../core/constants/api-endpoints';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class PatientService {
  private readonly apiService = inject(ApiService);

  public createPatient(
    patient: PatientModel,
  ): Observable<ApiResponse<PatientModel>> {
    return this.apiService.postObservable(
      API_ENDPOINTS.PATIENTS.CREATE,
      patient,
    ) as Observable<ApiResponse<PatientModel> | any>;
  }

  public getAllPatients(
    page: number = 0,
    size: number = 20,
  ): Observable<ApiResponse<PageResponse<PatientModel>>> {
    const params = new HttpParams()
      .set('active', 'true')
      .set('page', page.toString())
      .set('size', size.toString());

    return this.apiService.getObservable(
      API_ENDPOINTS.PATIENTS.GET_ALL,
      params,
    ) as Observable<ApiResponse<PageResponse<PatientModel>>>;
  }

  searchPatientByKeyword(keyword: string, page: number = 0) {
    // const params = new HttpParams().set('keyword', keyword.trim());
    const params = new HttpParams()
      .set('active', 'true')
      .set('keyword', keyword.trim())
      .set('page', page.toString() || '0')
      .set('size', 100);
    return this.apiService.getObservable(API_ENDPOINTS.PATIENTS.SEARCH, params);
  }

  public updatePatient(patientId: number, patient: PatientModel): Observable<ApiResponse<PatientModel>> {

      // const params = new HttpParams()
      //   .set('patientId', patientId.toString());

      return this.apiService.putObservable(`${API_ENDPOINTS.PATIENTS.UPDATE}/${patientId}`, patient
      ) as Observable<ApiResponse<PatientModel>>;
    }
    
  deletePatient( patientId: number) {
    const params = new HttpParams().set('patientId', patientId.toString());
    return this.apiService.deleteObservable(API_ENDPOINTS.PATIENTS.DELETE, params);
  }
  
  isPatientExists(abhaId: string) {
    const params = new HttpParams().set('abhaId', abhaId);
    return this.apiService.getObservable(API_ENDPOINTS.PATIENTS.EXISTS, params);
  }

}
