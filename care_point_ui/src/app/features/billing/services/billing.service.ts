import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { API_ENDPOINTS } from '../../../core/constants/api-endpoints';
import { ApiResponse } from '../../../core/models/api-response.model';
import { ServiceModel } from '../models/service-model';
import { CreateBillRequest } from '../models/createbill-request';
import { BillModel } from '../models/bill-model';

@Injectable({
  providedIn: 'root',
})
export class BillingService {
  private readonly apiService = inject(ApiService);

  getAllServices(): Observable<ApiResponse<ServiceModel[]>> {
    return this.apiService.getObservable(
      API_ENDPOINTS.SERVICE.SERVICE.GET_ALL,
    ) as Observable<ApiResponse<ServiceModel[]>>;
  }

  createBill(request: CreateBillRequest): Observable<ApiResponse<any>> {
    return this.apiService.postObservable(
      API_ENDPOINTS.BILL.CREATE,
      request,
    ) as Observable<ApiResponse<any>>;
  }


  getAllBills(): Observable<ApiResponse<BillModel[]>> {
  return this.apiService.getObservable(
    API_ENDPOINTS.BILL.BILLS,
  ) as Observable<ApiResponse<BillModel[]>>;
}
}