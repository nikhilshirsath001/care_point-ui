import { Injectable } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { API_ENDPOINTS } from '../../../core/constants/api-endpoints';

@Injectable({
  providedIn: 'root',
})
export class StaffService {
  constructor(private apiService: ApiService) {}

  getAllStaff(): Observable<any> {
    const params = new HttpParams().set('page', 0).set('size', 20);
    return this.apiService.getObservable(API_ENDPOINTS.STAFF.BASE, params);
  }

  getAllDoctors(): Observable<any> {
    const params = new HttpParams().set('page', 0).set('size', 20);
    return this.apiService.getObservable(API_ENDPOINTS.STAFF.BASE, params);
  }

  createStaff(data: any): Observable<any> {
    return this.apiService.postObservable(API_ENDPOINTS.STAFF.BASE, data);
  }
}
