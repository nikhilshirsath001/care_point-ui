import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from '../../core/services/api.service';
import { API_ENDPOINTS } from '../../core/constants/api-endpoints';
import { Discharge ,CreateDischargeRequest } from './models/discharge-model';

@Injectable({
  providedIn: 'root'
})
export class DischargeService {
  private api = inject(ApiService);

  createDischarge(data: CreateDischargeRequest): Observable<any> {
    return this.api.postObservable(
      API_ENDPOINTS.DISCHARGE.CREATE,
      data
    );
  }

  getAllDischarges(): Observable<any> {
    return this.api.getObservable(
      API_ENDPOINTS.DISCHARGE.GET_ALL
    );
  }

  getDischargeById(dischargeId: number): Observable<any> {
    return this.api.getObservable(
      `${API_ENDPOINTS.DISCHARGE.GET_BY_ID}/${dischargeId}`
    );
  }

  updateDischarge(
    dischargeId: number,
    data: CreateDischargeRequest
  ): Observable<any> {
    return this.api.putObservable(
      `${API_ENDPOINTS.DISCHARGE.UPDATE}/${dischargeId}`,
      data
    );
  }

  deleteDischarge(dischargeId: number): Observable<any> {
    return this.api.deleteObservable(
      `${API_ENDPOINTS.DISCHARGE.DELETE}/${dischargeId}`
    );
  }
}
