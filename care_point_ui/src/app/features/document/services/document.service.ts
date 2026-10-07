import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpEvent, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { API_ENDPOINTS } from '../../../core/constants/api-endpoints';

export interface DocumentUploadRequest {
  id: string;
  documentType: string;
  file: File;
  patientId: number;
  visitId?: number | null;
  admissionId?: number | null;
}

@Injectable({ providedIn: 'root' })
export class DocumentService {

  private apiService = inject(ApiService);


  uploadDocument(patientId: number, uploadedBy: number, visitId: number | null, admissionId: number | null, document: DocumentUploadRequest):
    Observable<HttpEvent<any>> {
    const formData = new FormData();

    formData.append('patientId', String(patientId));
    formData.append('uploadedBy', String(uploadedBy));

    if (visitId !== null && visitId !== undefined) {
      formData.append('visitId', String(visitId));
    }
    
    if (admissionId !== null && admissionId !== undefined) {
      formData.append('admissionId', String(admissionId));
    }

    formData.append('documentType', document.documentType);
    formData.append('file', document.file, document.file.name);

    return this.apiService.postObservableTest(
      API_ENDPOINTS.DOCUMENT.UPLOAD,
      formData,
      {
        observe: 'events',
        reportProgress: true
      }
    );
  }


uploadDocuments(patientId: number, uploadedBy: number, visitId: number | null, admissionId: number | null, documents: DocumentUploadRequest[]):
    Observable<HttpEvent<any>> {
    const formData = new FormData();

    formData.append('patientId', String(patientId));
    formData.append('uploadedBy', String(uploadedBy));

    if (visitId !== null && visitId !== undefined) {
      formData.append('visitId', String(visitId));
    }
    if (admissionId !== null && admissionId !== undefined) {
      formData.append('admissionId', String(admissionId));
    }

    const metadata = documents.map(document => ({
      id: document.id,
      documentType: document.documentType
    }));

    formData.append('documents', JSON.stringify(metadata));

    documents.forEach(document => {
      formData.append(document.id, document.file, document.file.name);
    });

    return this.apiService.postObservableTest(
      API_ENDPOINTS.DOCUMENT.UPLOAD_ALL,
      formData,
      {
        observe: 'events',
        reportProgress: true
      }
    );
  }


  getDocumentsByPatientId(patientId: number):any {
    const params = new HttpParams().set('patientId',patientId);
    return this.apiService.getObservable(API_ENDPOINTS.DOCUMENT.GET_ALL_BY_PATIENT_ID, params);
  }

  deleteDocument(documentId: number | string) {
    const params = new HttpParams();
    params.set('documentId',documentId);
    return this.apiService.getObservable(API_ENDPOINTS.DOCUMENT.GET_ALL_BY_PATIENT_ID, params);
  }

  downloadDocument(documentId: number | string) {
    return this.apiService.getObservableURI<Blob>(
      API_ENDPOINTS.DOCUMENT.DOWNLOAD.replace(':id', String(documentId)),
      {
        responseType: 'blob'
      }
    );
  }

  // getCategories(): Observable<{ label: string; value: string | null }[]> {
  //   return this.apiService
  //     .getObservable(API_ENDPOINTS.DOCUMENT.GET_DOC_TYPES)
  //     .pipe(
  //       map((types: any) => [
  //         {
  //           label: 'All Categories',
  //           value: null
  //         },
  //         ...types.map((type: string) => ({
  //           label: this.formatCategoryLabel(type),
  //           value: type
  //         }))
  //       ])
  //     );
  // }

  // private formatCategoryLabel(type: string): string {
  //   return type
  //     .toLowerCase()
  //     .split('_')
  //     .map(word => word.charAt(0).toUpperCase() + word.slice(1))
  //     .join(' ');
  // }


}
