import {
  Component,
  OnInit,
  ViewChild,
  inject,
  signal,
} from '@angular/core';

import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { DynamicFormComponent } from '../../../../shared/dynamic-form/dynamic-form.component';

import { PATIENT_FORM_CONFIG } from './patient-form.config';

import { PatientService } from '../../services/patient-service.service';
import { PatientModel } from '../../models/patient-model';

import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TabViewModule } from 'primeng/tabview';
import { API_NAVIGATION } from '../../../../core/constants/api-endpoints';

@Component({
  selector: 'app-patient-create',
  standalone: true,
  imports: [
    CommonModule,
    DynamicFormComponent,
    ButtonModule,
    DialogModule,
    TabViewModule,
  ],
  templateUrl: './patient-create.component.html',
  styleUrl: './patient-create.component.css',
})
export class PatientCreateComponent implements OnInit {

  private readonly patientService = inject(PatientService);
  private readonly router = inject(Router);

  patient: PatientModel | null = null;

  /**
   * Keep a copy of the original patient.
   * This is useful when editing and the user clicks Reset.
   */
  originalPatient: PatientModel | null = null;

  isEditMode = false;

  patientFormConfig = PATIENT_FORM_CONFIG;

  loading = false;

  @ViewChild(DynamicFormComponent)
  dynamicForm!: DynamicFormComponent;

  ngOnInit(): void {
    this.loadPatientFromNavigation();
  }

  private loadPatientFromNavigation(): void {

    const state = history.state;
    const patient = state?.['patient'];
    const mode = state?.['mode'];

    this.patientFormConfig.fields = this.patientFormConfig.fields.filter(field => field.name !== 'active');
    if (mode === 'edit' && patient) {

      this.isEditMode = true;
      this.patientFormConfig.showReset = false;
      this.patient = patient;
      this.originalPatient = structuredClone(patient);
      return;
    }

    this.isEditMode = false;
    this.patient = null;
    this.originalPatient = null;
  }

  onSubmit(formData: Record<string, any>): void {

    if (this.loading) {
      return;
    }

    const patient = this.mapFormToPatient(formData);

    this.loading = true;

    if (this.isEditMode) {
      this.updatePatient(patient);
    } else {
      this.createPatient(patient);
    }
  }

  private createPatient(patient: PatientModel): void {

    this.patientService.createPatient(patient).subscribe({

      next: () => {

        this.loading = false;

        void this.router.navigate([API_NAVIGATION.PATIENTS.LIST]);
        // console.log('Patient created successfully:', patient);
        this.onReset();
      },

      error: (error) => {

        console.error('Create patient failed:', error);

        this.loading = false;
      },

    });
  }

  private updatePatient(patient: PatientModel): void {

    /**
     * Make sure the existing patient ID is retained.
     */
    patient.patientId = this.patient?.patientId ?? 0;

    this.patientService.updatePatient(
      patient.patientId,
      patient
    ).subscribe({

      next: () => {

        this.loading = false;

        void this.router.navigate([API_NAVIGATION.PATIENTS.LIST]);
      },

      error: (error) => {

        console.error('Update patient failed:', error);

        this.loading = false;
      },

    });
  }

  private mapFormToPatient(
    formData: Record<string, any>
  ): PatientModel {

    return {
      // patientId: this.patient?.patientId ?? 0,

      abhaId: formData['abhaId'] ?? '',
      firstName: formData['firstName'] ?? '',
      lastName: formData['lastName'] ?? '',
      dateOfBirth: formData['dateOfBirth'] ?? '',
      gender: formData['gender'] ?? '',
      bloodGroup: formData['bloodGroup'] ?? '',

      phone: formData['phone'] ?? '',
      email: formData['email'] ?? '',

      address: formData['address'] ?? '',
      city: formData['city'] ?? '',
      state: formData['state'] ?? '',
      pincode: formData['pincode'] ?? '',

      emergencyContactName:
        formData['emergencyContactName'] ?? '',

      emergencyContactPhone:
        formData['emergencyContactPhone'] ?? '',
    };
  }

  onCancel(): void {
    void this.router.navigate([API_NAVIGATION.PATIENTS.LIST]);
  }

  onReset(): void {
    if (!this.isEditMode) {
      this.patient = null;
      return;
    }
    this.patient = structuredClone(this.originalPatient);
  }

  eventHandler(event: {fieldName: string; eventType: string; value: any;}) {
    
    const abhaId = event.value?.trim();
      if (!abhaId) { return; }

      if (event.fieldName === 'abhaId' && event.value.length > 6 && event.value.length < 15) {
      this.patientService.isPatientExists(event.value).subscribe({
        next: (response: any) => {
          if(response.status === 1) {
            this.dynamicForm.setFieldError( 'abhaId', 'exists', 'ABHA ID already exists.' );
          }else{
            this.dynamicForm.clearFieldError('abhaId', 'exists');
          }
        },
         error: (error) => {}
      });
    }
  }

}
