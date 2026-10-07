
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges
} from '@angular/core';

import { DynamicFormComponent } from '../../../../shared/dynamic-form/dynamic-form.component';
import { DynamicFormConfig } from '../../../../core/models/dynamic-form.model';

import { Visit, VisitRequest} from '../../models/visit.model';
import { VisitService } from '../../services/visit.service';
import { VISIT_FORM_CONFIG } from '../../config/visit-form.config';

import { AdministratorService } from '../../../administrator/services/administrator.service';
import { StaffService } from '../../../staff/services/staff.service';
import { PatientService } from '../../../patient/services/patient-service.service';

@Component({
  selector: 'app-visit-form',
  standalone: true,
  imports: [DynamicFormComponent],
  templateUrl: './visit-form.component.html',
  styleUrl: './visit-form.component.css'
})
export class VisitFormComponent implements OnChanges {

  @Input()
  mode: 'create' | 'edit' = 'create';

  @Input()
  visit: Visit | null = null;

  @Output()
  saved = new EventEmitter<void>();

  @Output()
  cancelled = new EventEmitter<void>();

  formConfig: DynamicFormConfig = {
    ...VISIT_FORM_CONFIG,

    fields: VISIT_FORM_CONFIG.fields.map(field => ({
      ...field,
      options: field.options
        ? [...field.options]
        : undefined
    }))
  };

  loading = false;

  constructor(
    private visitService: VisitService,
    private administratorService: AdministratorService,
    private staffService: StaffService,
    private patientService: PatientService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {

    if (
      changes['mode'] ||
      changes['visit']
    ) {
      this.prepareForm();
    }

  }

  private prepareForm(): void {

    this.loadPatientOptions();
    this.loadDoctorOptions();
    this.loadDepartmentOptions();
    this.loadDiagnosisOptions();
    }


 private loadPatientOptions(): void {
  this.patientService.getAllPatients().subscribe({
    next: (response: any) => {

      console.log('PATIENT API RESPONSE:', response);

      const patients = response?.data?.content ??
        response?.data ??
        response ??
        [];

      console.log('PATIENTS USED FOR DROPDOWN:', patients);

      const field = this.formConfig.fields.find(
        field => field.name === 'patientId'
      );

      console.log('PATIENT FIELD:', field);

      if (field) {
        field.options = patients.map((patient: any) => ({
          label:
            `${patient.firstName ?? ''} ${patient.lastName ?? ''}`.trim(),
          value: patient.patientId
        }));

        console.log(
          'PATIENT DROPDOWN OPTIONS:',
          field.options
        );
      }
    },

    error: (error: any) => {
      console.error('PATIENT API ERROR:', error);
    }
  });
}


 private loadDoctorOptions(): void {
  this.staffService.getAllDoctors().subscribe({
    next: (response: any) => {

      console.log('DOCTOR API RESPONSE:', response);

      const doctors =
        response?.data?.content ??
        response?.data ??
        response ??
        [];


      const field = this.formConfig.fields.find(
        field => field.name === 'doctorId'
      );

      if (field) {
        field.options = doctors.map((doctor: any) => ({
          label:
            `${doctor.firstName ?? ''} ${doctor.lastName ?? ''}`.trim(),
          value: doctor.staffId ?? doctor.id
        }));

        console.log(
          'DOCTOR DROPDOWN OPTIONS:',
          field.options
        );
      }
    },

    error: (error: any) => {
      console.error('DOCTOR API ERROR:', error);
    }
  });
} 



private loadDiagnosisOptions(): void {
  this.administratorService.getAllDiagnosis().subscribe({
    next: (response: any) => {

      console.log('DIAGNOSIS API RESPONSE:', response);

      const diagnoses =
        response?.data?.content ??
        response?.data ??
        response ??
        [];

      

      const field = this.formConfig.fields.find(
        field => field.name === 'diagnosisId'
      );

      if (field) {
        field.options = diagnoses.map((diagnosis: any) => ({
          label: diagnosis.diagnosisName,
          value: diagnosis.diagnosisId
        }));

      }
    },

    error: (error: any) => {
      console.error(
        'DIAGNOSIS API ERROR:',
        error
      );
    }
  });
}
  

  private loadDepartmentOptions(): void {
  this.administratorService.getAllDepartments().subscribe({
    next: (response: any) => {

      console.log('DEPARTMENT API RESPONSE:', response);

      const departments =
        response?.data?.content ??
        response?.data ??
        response ??
        [];

      console.log(
        'DEPARTMENTS USED FOR DROPDOWN:',
        departments
      );

      const field = this.formConfig.fields.find(
        field => field.name === 'departmentId'
      );

      if (field) {
        field.options = departments.map((department: any) => ({
          label: department.departmentName,
          value: department.departmentId
        }));

        console.log(
          'DEPARTMENT DROPDOWN OPTIONS:',
          field.options
        );
      }
    },

    error: (error: any) => {
      console.error(
        'DEPARTMENT API ERROR:',
        error
      );
    }
  });
}


  onSubmit(formData: Record<string, any>): void {

  console.log('FORM SUBMITTED:', formData);

  const request: VisitRequest = {
    patientId: Number(formData['patientId']),

    doctorId: formData['doctorId']
      ? Number(formData['doctorId'])
      : undefined,

    departmentId: formData['departmentId']
      ? Number(formData['departmentId'])
      : undefined,

      diagnosisId: formData['diagnosisId']
      ? Number(formData['diagnosisId'])
      : undefined,

    visitType: formData['visitType'],

visitDate: formData['visitDate']
  ? new Date(formData['visitDate']).toISOString()
  : undefined,
    reason: formData['reason']
  };

  console.log('VISIT REQUEST:', request);

  this.loading = true;

  if (this.mode === 'create') {
    this.createVisit(request);
  } else {
    this.updateVisit(request);
  }
}


 private createVisit(request: VisitRequest): void {

  console.log('CALLING CREATE VISIT API:', request);

  this.visitService.createVisit(request).subscribe({

    next: (response: any) => {

      console.log('CREATE VISIT RESPONSE:', response);

      this.loading = false;
      this.saved.emit();
    },

    error: (error: any) => {

      console.error('CREATE VISIT ERROR:', error);
      console.error('ERROR STATUS:', error?.status);
      console.error('ERROR RESPONSE:', error?.error);

      this.loading = false;
    }

  });

  }


  private updateVisit(
    request: VisitRequest
  ): void {

    if (!this.visit?.visitId) {

      console.error(
        'Visit ID is missing'
      );

      this.loading = false;

      return;

    }

    this.visitService
      .updateVisit(
        this.visit.visitId,
        request
      )
      .subscribe({

        next: () => {

          this.loading = false;

          this.saved.emit();

        },

        error: (error: any) => {

          this.loading = false;

          console.error(
            'Failed to update visit',
            error
          );

        }

      });

  }


  onCancel(): void {

    this.cancelled.emit();

  }

}