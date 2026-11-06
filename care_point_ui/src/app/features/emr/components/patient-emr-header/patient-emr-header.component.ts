import { Component, OnInit, inject, computed, signal, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import {
  SharedTableComponent,
  TableColumn
} from '../../../../shared/shared-table/shared-table.component';
import { ClinicalRecordFormComponent } from '../clinical-record-form/clinical-record-form.component';
import { EmrService } from '../../services/emr.service';
import { PatientService } from '../../../patient/services/patient-service.service';

// TODO: change to your real patient edit route
const PATIENT_EDIT_ROUTE = '/main/patient/edit';

@Component({
  selector: 'app-patient-emr-header',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    SharedTableComponent,
    DialogModule,
    ClinicalRecordFormComponent
  ],
  templateUrl: './patient-emr-header.component.html',
  styleUrl: './patient-emr-header.component.css'
})
export class PatientEmrHeaderComponent implements OnInit {
  @Output() deletePatient = new EventEmitter<any>();
  @Output() patientSelected = new EventEmitter<number>();
  @Output() viewPatientDetails = new EventEmitter<any>();
  @Output() createClinicalData = new EventEmitter<void>();

  private readonly emrService = inject(EmrService);
  private readonly patientService = inject(PatientService);
  private readonly router = inject(Router);

  patients = signal<any[]>([]);
  filteredPatients = signal<any[]>([]);

  first = signal(0);
  pageSize = signal(10);
  pagedPatients = computed(() =>
    this.filteredPatients().slice(this.first(), this.first() + this.pageSize())
  );

  showClinicalRecordForm = false;

  patientColumns: TableColumn[] = [
    { field: 'patientName', header: 'Patient Name' },
    { field: 'abhaId', header: 'ABHA ID' },
    { field: 'gender', header: 'Gender' },
    { field: 'age', header: 'Age' },
    { field: 'phone', header: 'Contact Number' },
    { field: 'actions', header: 'Actions', type: 'action' }
  ];

  tableConfig: any = {
    searchable: true,
    paginator: true,
    rows: 10,
    rowsPerPageOptions: [10, 20, 50],
    exportable: true,
    showRefresh: true,
    loading: false,
    canViewHistory: true,
    canCreateClinicalData: true,
    emptyMessage: 'No patients with clinical records found'
  };

  ngOnInit(): void {
    this.loadPatients();
  }

  // The shared table may emit the row directly or wrapped as { data: row }
  private unwrapRow(event: any): any {
    return event?.data ?? event;
  }

  private getPatientId(row: any): number {
    return Number(row?.patientId ?? row?.id);
  }

  onEditPatient(event: any): void {
    console.log('onEditPatient called with:', event);
    const patient = this.unwrapRow(event);
    const patientId = this.getPatientId(patient);

    if (!Number.isFinite(patientId) || patientId <= 0) {
      console.error('Cannot edit: patient ID is missing.');
      return;
    }

    this.router.navigate([PATIENT_EDIT_ROUTE, patientId], {
      state: { patient }
    });
  }

 onDeletePatient(event: any): void {
  const patient = this.unwrapRow(event);
  const patientId = this.getPatientId(patient);
  if (!Number.isFinite(patientId) || patientId <= 0) return;

  const ok = confirm(
    `Remove ${patient?.patientName || 'this patient'}? The patient will be deactivated, not permanently deleted.`
  );
  if (!ok) return;

  this.patientService.deletePatient(patientId).subscribe({
    next: () => {
      const remaining = this.patients().filter(
        (p: any) => this.getPatientId(p) !== patientId
      );
      this.patients.set(remaining);
      this.filteredPatients.set(remaining);
    },
    error: (err: any) => console.error('Failed to delete patient:', err)
  });
}

  createClinicalRecord(): void {
    this.showClinicalRecordForm = true;
  }

  closeClinicalRecordForm(): void {
    this.showClinicalRecordForm = false;
  }

  onClinicalRecordSaved(): void {
    this.showClinicalRecordForm = false;
    this.loadPatients(); // a new record may add a patient to the list
  }

  private extractList(response: any): any[] {
    const data =
      response?.data?.content ??
      response?.data?.records ??
      response?.data?.items ??
      response?.data ??
      response?.content ??
      response?.items ??
      response;

    return Array.isArray(data) ? data : [];
  }

  private pick(obj: any, keys: string[]): any {
    for (const key of keys) {
      const value = obj?.[key];
      if (value !== null && value !== undefined && value !== '') {
        return value;
      }
    }
    return null;
  }

  loadPatients(): void {
    this.tableConfig = { ...this.tableConfig, loading: true };

    this.patientService.getAllPatients(0, 100).subscribe({
      next: (response: any) => {
        const allPatients = this.extractList(response);
        console.log('patients count:', allPatients.length, 'sample:', allPatients[0]);

        if (!allPatients.length) {
          this.setRows([]);
          return;
        }

        // Use the per-patient endpoint that already works on the EMR page
        const checks = allPatients.map((p: any) =>
          this.emrService.getMedicalRecordsByPatient(this.getPatientId(p)).pipe(
            map((res: any) => this.extractList(res).length > 0),
            catchError((err: any) => {
              console.error('Records check failed for patient', this.getPatientId(p), err);
              return of(false);
            })
          )
        );

        forkJoin(checks).subscribe((flags: boolean[]) => {
          const withRecords = allPatients.filter((_: any, i: number) => flags[i]);
          console.log('patients with clinical records:', withRecords.length);
          this.setRows(withRecords);
        });
      },
      error: (error: any) => {
        console.error('Failed to load patients:', error);
        this.setRows([]);
      }
    });
  }

  private setRows(source: any[]): void {
    const rows = source.map((patient: any) => {
      const first = this.pick(patient, ['firstName', 'first_name', 'patientFirstName', 'fname']);
      const middle = this.pick(patient, ['middleName', 'middle_name']);
      const last = this.pick(patient, ['lastName', 'last_name', 'patientLastName', 'lname']);

      const fullName =
        [first, middle, last].filter(Boolean).join(' ') ||
        this.pick(patient, ['patientName', 'fullName', 'name']) ||
        '';

      const dob = this.pick(patient, [
        'dateOfBirth', 'dob', 'birthDate', 'date_of_birth', 'patientDob'
      ]);

      return {
        ...patient,
        patientId: patient.patientId ?? patient.id,
        patientName: String(fullName).replace(/\s+/g, ' ').trim(),
        abhaId: this.pick(patient, ['abhaId', 'abhaNumber', 'abhaAddress', 'abha_id']),
        age: this.calculateAge(dob),
        bloodGroup: this.pick(patient, ['bloodGroup', 'blood_group']),
        phone: this.pick(patient, [
          'phone', 'mobileNumber', 'patientMob', 'mobile', 'contactNumber'
        ])
      };
    });

    this.patients.set(rows);
    this.filteredPatients.set(rows);
    this.tableConfig = { ...this.tableConfig, loading: false };
  }

  onPageChange(event: { page: number; size: number; first: number }): void {
    this.first.set(event.first);
    this.pageSize.set(event.size);
  }

  onSearch(searchValue: string): void {
    this.first.set(0);

    const keyword = (searchValue ?? '').trim().toLowerCase();

    if (!keyword) {
      this.filteredPatients.set([...this.patients()]);
      return;
    }

    const filtered = this.patients().filter((patient: any) => {
      const searchableText = [
        patient.patientName,
        patient.abhaId,
        patient.phone,
        patient.gender
      ].join(' ').toLowerCase();

      return searchableText.includes(keyword);
    });

    this.filteredPatients.set(filtered);
  }

  onRefresh(): void {
    this.first.set(0);
    this.loadPatients();
  }

  onViewPatient(patient: any): void {
    const patientId = this.getPatientId(patient);

    if (!patientId) {
      return;
    }

    this.patientSelected.emit(patientId);
    this.viewPatientDetails.emit(patient);
  }

  calculateAge(dob: string): number | string {
    if (!dob) {
      return '-';
    }

    const birthDate = new Date(dob);
    const today = new Date();

    if (isNaN(birthDate.getTime()) || birthDate > today) {
      return '-';
    }

    let age = today.getFullYear() - birthDate.getFullYear();

    const hasBirthdayPassed =
      today.getMonth() > birthDate.getMonth() ||
      (today.getMonth() === birthDate.getMonth() &&
        today.getDate() >= birthDate.getDate());

    if (!hasBirthdayPassed) {
      age--;
    }

    return age;
  }

  openPatientHistory(event: any): void {
    console.log('openPatientHistory called with:', event);

    const patient = this.unwrapRow(event);
    const patientId = this.getPatientId(patient);

    if (!Number.isFinite(patientId) || patientId <= 0) {
      console.error('Cannot open EMR: patient ID is missing.');
      return;
    }

    this.router.navigate(['/main/emr/patient', patientId], {
      state: { patient }
    });
  }
}