  import { Injectable } from '@angular/core';
  import { Observable } from 'rxjs';
  import { ApiService } from '../../../core/services/api.service';
  import { VisitRequest } from '../models/visit.model';
import { HttpParams } from '@angular/common/http';

  @Injectable({
    providedIn: 'root'
  })
  export class VisitService {

  constructor(private apiService: ApiService) {}

  getVisits(): Observable<any> {
      return this.apiService.getObservable('/visits');
    }

    getVisitById(visitId: number): Observable<any> {
      return this.apiService.getObservable(`/visits/${visitId}`);
    }

    createVisit(request: VisitRequest): Observable<any> {
      return this.apiService.postObservable('/visits',request);
    }

    updateVisit( visitId: number, request: VisitRequest): Observable<any> {
      return this.apiService.putObservable(`/visits/${visitId}`,request );
    }

    updateVisitStatus(visitId: number,status: string): Observable<any> {
      return this.apiService.patchObservable(
        `/visits/${visitId}/status`,
        { status }
      );
    } 

    getDiagnoses(): Observable<any> {
    return this.apiService.getObservable('/diagnosis/diagnosis');
  }

  getVisitsByPatientId(patientId:number,page?:number,size?:number): Observable<any> {
    let params = new HttpParams()
    .set('patientId', patientId);
    if (page !== undefined && size !== undefined){
      params = params
      .set('page', page)
      .set('size', size);
    }
    console.log(params);
    return this.apiService.getObservable('/visits',params);
  }    

  
  getAdmissionsByPatientOrAbhaId(patientId?:number,abhaId?:any,page?:number,size?:number): Observable<any> {
    let params = new HttpParams();

    if (patientId !== undefined && patientId !== null) {
      params = params.set('patientId', patientId.toString());
    }

    if (abhaId !== undefined && abhaId !== '') {
      params = params.set('abhaId', abhaId);
    }

    if (page !== undefined && size !== undefined){
      params = params
      .set('page', page)
      .set('size', size);
    }
    return this.apiService.getObservable('/hmis/admission',params);
  }    

}