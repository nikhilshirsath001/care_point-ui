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

  getAllStaff(page = 0, size = 20, active?: boolean): Observable<any> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (active !== undefined) {
      params = params.set('active', active);
    }

    return this.apiService.getObservable(API_ENDPOINTS.STAFF.BASE, params);
  }

  getAllDoctors(): Observable<any> {
    const params = new HttpParams().set('page', 0).set('size', 20);

    return this.apiService.getObservable(API_ENDPOINTS.STAFF.BASE, params);
  }

  createStaff(data: any): Observable<any> {
    return this.apiService.postObservable(API_ENDPOINTS.STAFF.BASE, data);
  }

  updateStaff(staffId: number, data: any): Observable<any> {
    const url = API_ENDPOINTS.STAFF.UPDATE.replace(
      '{staffId}',
      String(staffId),
    ).replace(':staffId', String(staffId));

    return this.apiService.putObservable(url, data);
  }

  deleteStaff(staffId: number): Observable<any> {
    const url = API_ENDPOINTS.STAFF.DELETE.replace(
      '{staffId}',
      String(staffId),
    ).replace(':staffId', String(staffId));

    return this.apiService.deleteObservable(url);
  }

  changeStaffStatus(staffId: number, status: boolean): Observable<any> {
    const url = API_ENDPOINTS.STAFF.CHANGE_STATUS.replace(
      '{staffId}',
      String(staffId),
    ).replace(':staffId', String(staffId));
    const params = new HttpParams().set('status', String(status));
    return this.apiService.patchObservableById(url, params);
  }

  searchStaff(search: string, page: number, size: number): Observable<any> {
    const params = new HttpParams()
      .set('search', search)
      .set('page', page)
      .set('size', size);

    return this.apiService.getObservable(API_ENDPOINTS.STAFF.BASE, params);
  }
}
