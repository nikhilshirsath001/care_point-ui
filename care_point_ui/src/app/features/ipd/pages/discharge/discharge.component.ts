import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicFormComponent } from '../../../../shared/dynamic-form/dynamic-form.component';
import {
  PatientSearchComponent,
  PatientSearchConfig
} from '../../../../shared/patient-search/patient-search.component';
import {
  SharedTableComponent,
  TableColumn
} from '../../../../shared/shared-table/shared-table.component';
import { DISCHARGE_FORM_CONFIG } from '../../../discharge/config/dischargeform-config';
import { DischargeService } from '../../../discharge/discharge.service';
import { IpdService } from '../../services/ipd.service';
import { StaffService } from '../../../staff/services/staff.service';
import { PatientService } from '../../../patient/services/patient-service.service';

@Component({
  selector: 'app-discharge',
  standalone: true,
  imports: [
    CommonModule,
    DynamicFormComponent,
    PatientSearchComponent,
    SharedTableComponent
  ],
  templateUrl: './discharge.component.html',
  styleUrl: './discharge.component.css'
})
export class DischargeComponent implements OnInit {

  formConfig = DISCHARGE_FORM_CONFIG;
  loading = false;

  selectedPatient: any | null = null;
  loadingAdmissions = false;
  noAdmissions = false;

  private allAdmissions: any[] = [];
  admittedRows: any[] = [];

  readonly patientSearchConfig: PatientSearchConfig = {
    title: 'Find Patient',
    description: 'Search for a patient by name, ABHA ID or mobile number.',
    placeholder: 'Enter patient name, ABHA ID or mobile number',
    searchButtonLabel: 'Search Patient',
    selectButtonLabel: 'Select Patient'
  };

  readonly searchPatientFn = (keyword: string) =>
    this.patientService.searchPatientByKeyword(keyword);

  readonly admittedColumns: TableColumn[] = [
    { field: 'admissionId', header: 'Admission ID' },
    { field: 'patientName', header: 'Patient' },
    { field: 'admissionDate', header: 'Admitted On', type: 'date' },
    { field: 'actions', header: 'Actions', type: 'action' }
  ];

  readonly admittedConfig: any = {
    searchable: false,
    paginator: true,
    rows: 10,
    rowsPerPageOptions: [10, 20, 50],
    exportable: false,
    showRefresh: false,
    loading: false,
    canView: true,
    canEdit: false,
    canDelete: false,
    emptyMessage: 'No patients are currently admitted'
  };

  constructor(
    private ipdService: IpdService,
    private staffService: StaffService,
    private dischargeService: DischargeService,
    private patientService: PatientService
  ) {}

  ngOnInit(): void {
    this.loadAdmittedPatients();
    this.getDoctors();
    this.loadDischargeTypes();
  }


  loadAdmittedPatients(): void {
    this.ipdService.getAllInPatients().subscribe({
      next: (res: any) => {
        const admissions = Array.isArray(res?.data)
          ? res.data
          : res?.data?.content ?? [];

        this.allAdmissions = admissions;

        this.admittedRows = admissions.map((item: any) => ({
          ...item,
          patientName: item.patientName ?? `Patient ${item.patientId}`
        }));
      },
      error: (error: any) =>
        console.error('Failed to load admitted patients', error)
    });
  }

  onSelectAdmitted(event: any): void {
    const row = event?.data ?? event;

    this.onPatientSelected({
      patientId: row?.patientId,
      patientName: row?.patientName
    });
  }


  onPatientSelected(patient: any): void {
    if (!patient?.patientId) {
      return;
    }

    this.selectedPatient = patient;
    this.loadAdmissionsForPatient(Number(patient.patientId));
  }

  changePatient(): void {
    this.selectedPatient = null;
    this.noAdmissions = false;
    this.setAdmissionOptions([]);
  }

  private loadAdmissionsForPatient(patientId: number): void {
    this.loadingAdmissions = true;
    this.noAdmissions = false;
    this.setAdmissionOptions([]);

    this.ipdService.getAllInPatients().subscribe({
      next: (res: any) => {
        const admissions = Array.isArray(res?.data)
          ? res.data
          : res?.data?.content ?? [];

        this.allAdmissions = admissions;

        const patientAdmissions = admissions.filter(
          (item: any) => Number(item.patientId) === patientId
        );

        const options = patientAdmissions.map((item: any) => {
          const date = item.admissionDate
            ? new Date(item.admissionDate).toLocaleDateString('en-GB')
            : '';

          return {
            label: `Admission #${item.admissionId}${date ? ' - ' + date : ''}`,
            value: item.admissionId
          };
        });

        this.setAdmissionOptions(options);
        this.noAdmissions = options.length === 0;
        this.loadingAdmissions = false;
      },
      error: (error: any) => {
        console.error('Failed to load admissions', error);
        this.setAdmissionOptions([]);
        this.loadingAdmissions = false;
      }
    });
  }

  private setAdmissionOptions(options: any[]): void {
    this.formConfig = {
      ...this.formConfig,
      fields: this.formConfig.fields.map(field =>
        field.name === 'admissionId'
          ? { ...field, options }
          : field
      )
    };
  }

  // ---------- Other dropdowns ----------

  getDoctors(): void {
    this.staffService.getAllStaff().subscribe({
      next: (res: any) => {
        const staff = res?.data?.content ?? [];

        const doctors = staff.filter((item: any) =>
          item.designation?.toUpperCase() === 'DOCTOR'
        );

        const options = doctors.map((doctor: any) => ({
          label: `${doctor.firstName ?? ''} ${doctor.lastName ?? ''}`.trim(),
          value: doctor.staffId
        }));

        this.formConfig = {
          ...this.formConfig,
          fields: this.formConfig.fields.map(field =>
            field.name === 'doctorId'
              ? { ...field, options }
              : field
          )
        };
      },
      error: (error: any) =>
        console.error('Failed to load doctors', error)
    });
  }

  loadDischargeTypes(): void {
    const options = [
      { label: 'Routine', value: 'ROUTINE' },
      { label: 'Discharge on Request', value: 'DISCHARGE_ON_REQUEST' },
      { label: 'Transfer', value: 'TRANSFER' },
      { label: 'Against Medical Advice', value: 'LAMA' },
      { label: 'Expired', value: 'EXPIRED' }
    ];

    this.formConfig = {
      ...this.formConfig,
      fields: this.formConfig.fields.map(field =>
        field.name === 'dischargeType'
          ? { ...field, options }
          : field
      )
    };
  }

  // ---------- Submit ----------

  onSubmit(formData: Record<string, any>): void {
    const dischargeDate = formData['dischargeDate'];

    const dischargeData = {
      admissionId: Number(formData['admissionId']),

      doctorId: formData['doctorId']
        ? Number(formData['doctorId'])
        : null,

      dischargeDate: `${dischargeDate}T00:00:00+05:30`,

      dischargeType: formData['dischargeType'],
      dischargeSummary: formData['dischargeSummary'] || ''
    };

    this.loading = true;

    this.dischargeService.createDischarge(dischargeData).subscribe({
      next: () => {
        this.loading = false;
        this.changePatient();        // back to the start for the next discharge
        this.loadAdmittedPatients(); // discharged patient leaves the table
      },
      error: (error: any) => {
        this.loading = false;
        console.error('Failed to create discharge', error);
      }
    });
  }

  onCancel(): void {
    this.changePatient();
  }
}
