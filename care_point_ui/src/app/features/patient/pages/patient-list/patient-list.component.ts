import { Component, inject, signal } from '@angular/core';
import {
  SharedTableComponent,
  SharedTableConfig,
  TableColumn,
} from '../../../../shared/shared-table/shared-table.component';
import { PATIENT_COLUMNS } from './patient-table.config';
import { PatientService } from '../../services/patient-service.service';
import { PatientModel } from '../../models/patient-model';
import { SharedDetailsComponent } from '../../../../shared/shared-details/shared-details.component';
import { Router } from '@angular/router';
import { API_NAVIGATION } from '../../../../core/constants/api-endpoints';
import { DocumentUploadComponent } from '../../../document/pages/document-upload/document-upload.component';
import { Dialog } from 'primeng/dialog';
import { DocumentItem } from '../../../document/model/document-model';
import { DocumentListComponent } from '../../../document/pages/document-list/document-list.component';

@Component({
  selector: 'app-patient-list',
  imports: [SharedTableComponent, SharedDetailsComponent, DocumentUploadComponent, Dialog, DocumentListComponent],
  templateUrl: './patient-list.component.html',
  styleUrl: './patient-list.component.css',
})
export class PatientListComponent {

  private patientService = inject(PatientService);
  private readonly router = inject(Router);

  patientColumns = PATIENT_COLUMNS;

  patients = signal<PatientModel[]>([]);
  filteredPatients = signal<PatientModel[]>([]);

  viewDialogVisible: boolean = false;
  selectedPatient = signal<any | null>(null);
  currentPage = 0;
  currentPageSize = 20;

  documentUploadVisible=false
  selectedPatientId!:number;
  selectedViewPatientId!:number;
  uploadedBy!:number;
  documents: DocumentItem[] = [];
  
  documentViewVisible=false

  viewPatient(patient: PatientModel): void {
    this.selectedPatient.set(patient);
    this.viewDialogVisible = true;
  }
  constructor() {
    this.loadPatients();
  }

  tableConfig: SharedTableConfig = {
    searchable: true,
    paginator: true,
    rows: 10,
    rowsPerPageOptions: [10, 20, 50, 100],
    exportable: true,
    showRefresh: true,
    loading: false,
    emptyMessage: 'No patients found',
    canUploadDocuments:true,
    canCreateNewRecord:true,
    canViewDocuments:true,
  };

  totalRecords = signal(0);

  onPageChange(event: { page: number; size: number; first: number }): void {
    this.currentPage = event.page;
    this.currentPageSize = event.size;
    this.loadPatients();
  }

  loadPatients(): void {
    this.patientService.getAllPatients(this.currentPage, this.currentPageSize).subscribe((response) => {
      this.patients.set(response.data?.content || []);
      this.filteredPatients.set(response.data?.content || []);
      this.totalRecords.set(response.data?.totalElements || 0);
    });
  }

  onRefresh() {
    this.loadPatients();
  }

editPatient(event: { patient: PatientModel }): void {
  this.router.navigate([API_NAVIGATION.PATIENTS.CREATE], {
    state: {
      patient: event,
      mode: 'edit'
    }
  });
}


  deletePatient(patient: PatientModel ) {
    const patientId = patient.patientId;
    if (patientId === undefined) {
      console.error('Patient ID is undefined. Cannot delete patient.');
      return;
    }
    const confirmDelete = window.confirm(`Are you sure you want to delete patient ${patient.firstName} ${patient.lastName}?`);
    if (confirmDelete) {
      this.patientService.deletePatient(patientId).subscribe({
        next: () => {
          this.loadPatients();
        },
        error: (error) => {
          console.error(`Failed to delete patient with ID ${patientId}:`, error);
        }
      });
    }
  }

  onSearch(searchValue: string) {
    if (searchValue.trim() !== '') {
      
      // this.currentPageSize = 100;
      // this.patientService.searchPatientByKeyword(searchValue, this.currentPage).subscribe((response) => {
        
      //   console.log('Search response:', response);
      //   this.filteredPatients.set(response.data?.data || []);
      // });

      this.filteredPatients.set(this.patients().filter((patient) => {
        const lowerSearchValue = searchValue.toLowerCase();
        return (
          patient.firstName.toLowerCase().includes(lowerSearchValue) ||
          patient.lastName.toLowerCase().includes(lowerSearchValue) ||
          // patient.email.toLowerCase().includes(lowerSearchValue) ||
          patient.phone.toLowerCase().includes(lowerSearchValue) ||
          patient.abhaId.toLowerCase().includes(lowerSearchValue)
        );
      }));
    }
    if (searchValue.trim() === '') {
      this.filteredPatients.set(this.patients());
    }
  }

  uploadPatientDocuments(patient: PatientModel) {
    this.documents = [];
    this.documentUploadVisible=true;
    this.uploadedBy=1;//update when login token
    this.selectedPatientId = patient?.patientId!;
    
  }
  closeDocumentUpload() {
    this.documentUploadVisible=false;
    this.uploadedBy!=null;
    this.selectedPatientId!=null;
    this.documents = [];
  }

  createNewPatient() {
    this.router.navigate([API_NAVIGATION.PATIENTS.CREATE]);
  }
  
  
  viewPatientDocuments(patient: PatientModel) {
    this.documents = [];
    this.documentViewVisible=true;
    this.selectedViewPatientId = patient?.patientId!;
    
  }

  closeViewPatientDocuments() {
    this.documentViewVisible=false;
    this.selectedViewPatientId!=null;
    this.documents = [];
    
  }

}
