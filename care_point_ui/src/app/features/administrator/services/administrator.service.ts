import { Injectable } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdministratorService {

  constructor(private apiService: ApiService) { }

  getAllDepartments():Observable<any>{
    return this.apiService.getObservable("/departments");
  }

  createDepartment(data:any){
    return this.apiService.postObservable("/departments",data);
  }
}
