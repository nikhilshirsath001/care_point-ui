import { Injectable } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../../../core/constants/api-endpoints';

@Injectable({
  providedIn: 'root'
})
export class AdministratorService {

  constructor(private apiService: ApiService) { }

    getAllDepartments(): Observable<any> {
    return this.apiService.getObservable(
      API_ENDPOINTS.DEPARTMENTS.GET_ALL
    );
  }

  createDepartment(data: any): Observable<any> {
    return this.apiService.postObservable(
      API_ENDPOINTS.DEPARTMENTS.CREATE,
      data
    );
  }
}
