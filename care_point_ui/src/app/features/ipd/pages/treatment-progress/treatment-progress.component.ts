import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { TooltipModule } from 'primeng/tooltip';

import { AdministratorService } from '../../../administrator/services/administrator.service';
import { PatientService } from '../../../patient/services/patient-service.service';
import { StaffService } from '../../../staff/services/staff.service';

import {
  PatientSearchComponent,
  PatientSearchConfig,
} from '../../../../shared/patient-search/patient-search.component';

import { IpdService } from '../../services/ipd.service';

@Component({
  selector: 'app-treatment-progress',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    CardModule,
    DatePickerModule,
    DialogModule,
    InputTextModule,
    SelectModule,
    TableModule,
    TagModule,
    TextareaModule,
    TooltipModule,
    PatientSearchComponent,
  ],
  templateUrl: './treatment-progress.component.html',
  styleUrl: './treatment-progress.component.css',
})
export class TreatmentProgressComponent implements OnInit {

  selectedPatient: any | null = null;
  selectedAdmission: any | null = null;

  treatmentList: any[] = [];
  prescriptionList: any[] = [];

  doctors: any[] = [];
  procedures: any[] = [];
  medications: any[] = [];

  loadingWorkspace = false;
  savingTreatment = false;
  savingPrescription = false;

  treatmentDialogVisible = false;
  prescriptionDialogVisible = false;

  treatmentForm = this.createTreatmentForm();
  prescriptionForm = this.createPrescriptionForm();

  readonly frequencyOptions: string[] = [
    'Once daily',
    'Twice daily',
    'Three times daily',
    'Four times daily',
    'Every 4 hours',
    'Every 6 hours',
    'Every 8 hours',
    'Every 12 hours',
    'As needed',
  ];

  readonly routeOptions: string[] = [
    'Oral',
    'IV',
    'IM',
    'SC',
    'Topical',
    'Inhalation',
    'Rectal',
    'Sublingual',
  ];

  readonly patientSearchConfig: PatientSearchConfig = {
    title: 'Find Patient',
    description:
      'Search for an existing patient using Patient ABHA ID, name or mobile number.',
    placeholder: 'Enter Patient ABHA ID, name or mobile number',
    searchButtonLabel: 'Search Patient',
    selectButtonLabel: 'Select Patient',
  };

  readonly searchPatientFn = (keyword: string) =>
    this.patientService.searchPatientByKeyword(keyword);

  constructor(
    private readonly patientService: PatientService,
    private readonly ipdService: IpdService,
    private readonly staffService: StaffService,
    private readonly administratorService: AdministratorService,
  ) {}

  ngOnInit(): void {
    this.loadDoctors();
    this.loadProcedures();
    this.loadMedications();
  }

  get lengthOfStay(): number {
    if (!this.selectedAdmission?.admissionDate) {
      return 0;
    }

    const admissionDate = new Date(this.selectedAdmission.admissionDate);

    const today = new Date();

    admissionDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    return Math.max(
      0,
      Math.floor(
        (today.getTime() - admissionDate.getTime()) / (1000 * 60 * 60 * 24),
      ),
    );
  }

  onPatientSelected(patient: any): void {
    this.resetWorkspace();

    this.selectedPatient = patient;

    if (!patient?.patientId) {
      return;
    }

    this.loadTreatmentWorkspace(patient.patientId);
  }

  openPrescriptionDialog(): void {
    if (!this.selectedPatient || !this.selectedAdmission) {
      return;
    }

    this.prescriptionForm = this.createPrescriptionForm();

    /*
     * Preselect the attending doctor when available.
     */
    this.prescriptionForm.doctorId =
      this.selectedAdmission.admittingDoctorId ?? null;

    /*
     * Start with one medicine row so the doctor
     * can immediately enter a prescription.
     */
    this.prescriptionForm.items.push(this.createPrescriptionItem());

    this.prescriptionDialogVisible = true;
  }

  addPrescriptionItem(): void {
    this.prescriptionForm.items.push(this.createPrescriptionItem());
  }

  removePrescriptionItem(index: number): void {
    if (index < 0 || index >= this.prescriptionForm.items.length) {
      return;
    }

    this.prescriptionForm.items.splice(index, 1);
  }

  savePrescription(): void {
    if (!this.selectedPatient || !this.selectedAdmission) {
      return;
    }

    if (!this.prescriptionForm.items.length) {
      console.warn('At least one medicine is required.');

      return;
    }

    const payload = {
      patientId: this.selectedPatient.patientId,

      admissionId: this.selectedAdmission.admissionId,

      doctorId: this.prescriptionForm.doctorId,

      prescriptionDate: this.prescriptionForm.prescriptionDate,

      notes: this.prescriptionForm.notes,

      items: this.prescriptionForm.items.map((item: any) => ({
        medicationId: item.medicationId,
        dosage: item.dosage,
        frequency: item.frequency,
        route: item.route,
        duration: item.duration,
        instructions: item.instructions,
      })),
    };

    this.savingPrescription = true;

    /*
     * ---------------------------------------------------------
     * TODO:
     * Replace this section with your PrescriptionService API.
     *
     * Example:
     */
    this.ipdService.createPrescription(payload).subscribe({
      next: (response: any) => {
        if (response?.status === 1) {
          this.prescriptionDialogVisible = false;
          this.loadTreatmentWorkspace(this.selectedPatient.patientId);
          this.loadPriscriptions(this.selectedPatient.patientId);
        }
      },
      error: (error) => {
        console.error('Failed to save prescription', error);
      },
      complete: () => {
        this.savingPrescription = false;
      },
    });

    console.log('Prescription payload:', payload);

    this.savingPrescription = false;
    this.prescriptionDialogVisible = false;
  }

  openTreatmentDialog(): void {
    if (!this.selectedAdmission) {
      return;
    }

    this.treatmentForm = this.createTreatmentForm();

    /*
     * Automatically select attending doctor
     * when available.
     */
    this.treatmentForm.doctorId =
      this.selectedAdmission.admittingDoctorId ?? null;

    this.treatmentDialogVisible = true;
  }

  saveTreatment(): void {
    if (!this.selectedAdmission) {
      return;
    }

    const payload = {
      admissionId: this.selectedAdmission.admissionId,

      doctorId: this.treatmentForm.doctorId,

      procedureId: this.treatmentForm.procedureId,

      treatmentDate: this.treatmentForm.treatmentDate,

      description: this.treatmentForm.description,

      remarks: this.treatmentForm.remarks,
    };

    this.savingTreatment = true;

    this.ipdService.createTreatment(payload).subscribe({
      next: (response: any) => {
        if (response?.status === 1) {
          this.treatmentDialogVisible = false;

          if (this.selectedPatient?.patientId) {
            this.loadTreatmentWorkspace(this.selectedPatient.patientId);
          }
        }
      },

      error: (error: any) => {
        console.error('Failed to save treatment', error);

        this.savingTreatment = false;
      },

      complete: () => {
        this.savingTreatment = false;
      },
    });
  }

  getAllTreatments(): void {
    if (!this.selectedAdmission?.admissionId) {
      return;
    }

    this.loadTreatments(this.selectedAdmission.admissionId);
  }

  getAllPrescriptions() {
    if (!this.selectedPatient?.patientId) {
      return;
    }

    this.loadPriscriptions(this.selectedPatient?.patientId);
  }

  viewTreatment(treatment: any): void {
    console.log('View treatment:', treatment);
  }

  viewProcedures(): void {
    /*
     * Navigate to procedures if/when routing is configured.
     */
    console.log('View procedures');
  }

  private loadTreatmentWorkspace(patientId: number): void {
    this.loadingWorkspace = true;

    this.ipdService.getTreatmentWorkspace(patientId).subscribe({
      next: (response: any) => {
        /*
         * Patient can exist without an admission.
         */
        if (response?.status !== 1 || !response?.data) {
          this.resetWorkspace();

          return;
        }

        const workspace = response.data;

        this.selectedPatient = workspace.patient ?? this.selectedPatient;

        this.selectedAdmission = workspace.admission ?? null;

        this.treatmentList = workspace.treatments ?? [];

        this.prescriptionList = workspace.prescriptions ?? [];

        /*
         * If patient has no admission, don't display
         * treatment/prescription workspace.
         */
        if (!this.selectedAdmission) {
          this.treatmentList = [];
          this.prescriptionList = [];
        }
      },

      error: (error: any) => {
        console.error('Failed to load treatment workspace', error);

        this.resetWorkspace();
      },

      complete: () => {
        this.loadingWorkspace = false;
      },
    });
  }

  private loadTreatments(admissionId: number): void {
    this.ipdService.getAllTreatmentsByAdmissionId(admissionId).subscribe({
      next: (response: any) => {
        this.treatmentList =
          response?.status === 1 ? (response.data ?? []) : [];
      },

      error: (error: any) => {
        console.error('Failed to load treatments', error);

        this.treatmentList = [];
      },
    });
  }

  private loadPriscriptions(patientId: number): void {
    this.ipdService.getPrescriptionsByPatientId(patientId).subscribe({
      next: (response: any) => {
        this.prescriptionList =
          response?.status === 1 ? (response.data ?? []) : [];
      },

      error: (error: any) => {
        console.error('Failed to load prescriptions', error);

        this.prescriptionList = [];
      },
    });
  }

  private loadDoctors(): void {
    this.staffService.getAllStaff().subscribe({
      next: (response: any) => {
        this.doctors = response?.data?.content ?? response?.data ?? [];
      },

      error: (error: any) => {
        console.error('Failed to load doctors', error);

        this.doctors = [];
      },
    });
  }

  private loadProcedures(): void {
    this.administratorService.getAllProcedures().subscribe({
      next: (response: any) => {
        this.procedures = response?.data ?? [];
      },

      error: (error: any) => {
        console.error('Failed to load procedures', error);

        this.procedures = [];
      },
    });
  }

  private loadMedications(): void {
    /*
     * Connect your MedicationService here.
     *
     * Example:
     */
    this.ipdService.getAllMedications().subscribe({
      next: (response: any) => {
        this.medications = response?.data?.content ?? response?.data ?? [];
      },
      error: (error: any) => {
        console.error('Failed to load medications', error);
        this.medications = [];
      },
    });

    this.medications = [];
  }

  private resetWorkspace(): void {
    this.selectedAdmission = null;

    this.treatmentList = [];
    this.prescriptionList = [];

    this.treatmentDialogVisible = false;
    this.prescriptionDialogVisible = false;

    this.treatmentForm = this.createTreatmentForm();

    this.prescriptionForm = this.createPrescriptionForm();
  }

  private createPrescriptionForm() {
    return {
      prescriptionDate: new Date(),

      doctorId: this.selectedAdmission?.admittingDoctorId ?? null,

      notes: '',

      items: [] as any[],
    };
  }

  private createPrescriptionItem() {
    return {
      medicationId: null,
      dosage: '',
      frequency: '',
      route: '',
      duration: '',
      instructions: '',
    };
  }

  private createTreatmentForm() {
    return {
      treatmentDate: new Date(),
      doctorId: null,
      procedureId: null,
      description: '',
      remarks: '',
    };
  }
}
