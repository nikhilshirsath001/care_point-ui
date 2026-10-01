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

@Component({
  selector: 'app-patient-list',
  imports: [SharedTableComponent, SharedDetailsComponent],
  templateUrl: './patient-list.component.html',
  styleUrl: './patient-list.component.css',
})
export class PatientListComponent {

  private patientService = inject(PatientService);
  private readonly router = inject(Router);

  patientColumns = PATIENT_COLUMNS;

  patients = signal<PatientModel[]>([]);

  viewDialogVisible: boolean = false;
  selectedPatient = signal<any | null>(null);
  currentPage = 0;
  currentPageSize = 20;

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
    rows: 20,
    rowsPerPageOptions: [10, 25, 50, 100],
    exportable: true,
    showRefresh: true,
    loading: false,
    emptyMessage: 'No patients found',
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
      this.totalRecords.set(response.data?.totalElements || 0);
    });
  }

  onRefresh() {
    this.loadPatients();
  }

editPatient(event: { patient: PatientModel }): void {
  console.log('Edit patient event received:', event.patient);
  this.router.navigate(['/main/patient/create'], {
    state: {
      patient: event,
      mode: 'edit'
    }
  });
}

}
