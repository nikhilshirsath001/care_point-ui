import {
  Component,
  EventEmitter,
  Output
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

import { DynamicFormComponent } from '../../../../shared/dynamic-form/dynamic-form.component';
import { CLINICAL_RECORD_FORM_CONFIG } from '../../config/clinical-record-form.config';
import { EmrService } from '../../services/emr.service';
import { Visit } from '../../../visit/models/visit.model';

@Component({
  selector: 'app-clinical-record-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    DynamicFormComponent
  ],
  templateUrl: './clinical-record-form.component.html',
  styleUrl: './clinical-record-form.component.css'
})
export class ClinicalRecordFormComponent {

  @Output() saved = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  enteredPatientId: number | null = null;

  formConfig = CLINICAL_RECORD_FORM_CONFIG;

  visits: Visit[] = [];
  selectedVisitId: number | null = null;
  selectedVisit: Visit | null = null;

  loading = false;
  visitsLoading = false;

  constructor(private emrService: EmrService) {}

  onPatientIdChange(): void {
    this.visits = [];
    this.selectedVisitId = null;
    this.selectedVisit = null;
  }

  loadVisits(): void {
    const patientId = Number(this.enteredPatientId);

    if (!Number.isInteger(patientId) || patientId <= 0) {
      console.error('Please enter a valid Patient ID');
      return;
    }

    this.visitsLoading = true;
    this.visits = [];
    this.selectedVisitId = null;
    this.selectedVisit = null;

    this.emrService.getVisits().subscribe({
      next: (response: any) => {
        console.log('Visits API Response:', response);

        const data =
          response?.data?.content ??
          response?.data?.records ??
          response?.data?.items ??
          response?.data ??
          response?.content ??
          response?.records ??
          response?.items ??
          response;

        const allVisits: Visit[] = Array.isArray(data) ? data : [];

        this.visits = allVisits.filter(
          visit => Number(visit.patientId) === patientId
        );

        console.log('Filtered Visits:', this.visits);

        this.visitsLoading = false;
      },
      error: (error: any) => {
        console.error('Failed to load visits:', error);
        this.visits = [];
        this.visitsLoading = false;
      }
    });
  }

  onVisitChange(): void {
    this.selectedVisit =
      this.visits.find(
        visit => Number(visit.visitId) === Number(this.selectedVisitId)
      ) ?? null;
  }

  onFormSubmit(formData: Record<string, any>): void {
    const patientId = Number(this.enteredPatientId);

    if (!Number.isInteger(patientId) || patientId <= 0) {
      console.error('Invalid Patient ID');
      return;
    }

    if (!this.selectedVisit) {
      console.error('Please select a visit');
      return;
    }

    const request = {
      patientId,
      visitId: this.selectedVisit.visitId,
      doctorId: this.selectedVisit.doctorId ?? null,
      diagnosisId: this.selectedVisit.diagnosisId ?? null,
      recordDate: formData['recordDate']
        ? new Date(formData['recordDate']).toISOString()
        : null,
      symptoms: formData['symptoms'] || null,
      treatment: formData['treatment'] || null,
      notes: formData['notes'] || null
    };

    console.log('Medical Record Request:', request);

    this.loading = true;

    this.emrService.createMedicalRecord(request).subscribe({
      next: (response: any) => {
        console.log('Medical record created:', response);
        this.loading = false;
        this.saved.emit();
      },
      error: (error: any) => {
        console.error('Medical record creation failed:', error);
        console.error('Backend error:', error.error);
        this.loading = false;
      }
    });
  }

  onFormCancel(): void {
    this.cancelled.emit();
  }
}