import { Injectable } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../../../core/constants/api-endpoints';

@Injectable({
  providedIn: 'root',
})
export class AdministratorService {
  constructor(private apiService: ApiService) {}

  getAllDepartments(): Observable<any> {
    return this.apiService.getObservable(API_ENDPOINTS.DEPARTMENTS.GET_ALL);
  }

  getAllProcedures(): Observable<any> {
    return this.apiService.getObservable(API_ENDPOINTS.PROCEDURE.GET_ALL);
  }

  getAllDiagnosis(): Observable<any> {
    return this.apiService.getObservable(API_ENDPOINTS.DIAGNOSIS.GET_ALL);
  }

  getAllServiceCategories(): Observable<any> {
    return this.apiService.getObservable(
      API_ENDPOINTS.SERVICE.SERVICE_CATEGORY.GET_ALL,
    );
  }

  getAllServices(): Observable<any> {
    return this.apiService.getObservable(API_ENDPOINTS.SERVICE.SERVICE.GET_ALL);
  }

  createDepartment(data: any): Observable<any> {
    return this.apiService.postObservable(
      API_ENDPOINTS.DEPARTMENTS.CREATE,
      data,
    );
  }

  createProcedure(data: any): Observable<any> {
    return this.apiService.postObservable(API_ENDPOINTS.PROCEDURE.CREATE, data);
  }

  createDiagnosis(data: any): Observable<any> {
    return this.apiService.postObservable(API_ENDPOINTS.DIAGNOSIS.BASE, data);
  }

  createServiceCategory(data: any): Observable<any> {
    return this.apiService.postObservable(
      API_ENDPOINTS.SERVICE.SERVICE_CATEGORY.CREATE,
      data,
    );
  }

  createService(data: any): Observable<any> {
    return this.apiService.postObservable(
      API_ENDPOINTS.SERVICE.SERVICE.CREATE,
      data,
    );
  }

  getAllUsers(currentPage: any, currentPageSize: any): Observable<any> {
    return this.apiService.getObservable(API_ENDPOINTS.USER.GET_ALL);
  }
  createUser(data: any): Observable<any> {
    return this.apiService.postObservable(API_ENDPOINTS.USER.CREATE, data);
  }
  updateUser(userId: number, editUserObj: any) {
    return this.apiService.putObservable(
      `${API_ENDPOINTS.USER.UPDATE}/${userId}`,
      editUserObj,
    );
  }
  deleteUser(userId: any) {
    return this.apiService.deleteObservable(
      `${API_ENDPOINTS.USER.DELETE}/${userId}`,
    );
  }
}
