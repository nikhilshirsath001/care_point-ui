  import { Injectable } from '@angular/core';
  import { Observable } from 'rxjs';
  import { ApiService } from '../../../core/services/api.service';
  import { VisitRequest } from '../models/visit.model';

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
  }