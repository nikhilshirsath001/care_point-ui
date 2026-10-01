import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RadioButtonModule } from 'primeng/radiobutton';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { Router } from '@angular/router';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import {
  SharedTableConfig,
  TableColumn,
} from '../../../../shared/shared-table/shared-table.component';
import { StaffService } from '../../../staff/services/staff.service';
import { IpdService } from '../../services/ipd.service';
import { BedWardService } from '../../../bed-ward/services/bed-ward.service';
import { PatientService } from '../../../patient/services/patient-service.service';
import { Admission, BedAssignment } from '../../models/admission.model';
import { TableModule } from 'primeng/table';
import { ADMISSION_TYPES, STATUS_LIST } from '../../config/ipd-form.config';

@Component({
  selector: 'app-admission',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    SelectModule,
    DatePickerModule,
    InputTextModule,
    TextareaModule,
    DialogModule,
    TagModule,
    AutoCompleteModule,
    FormsModule,
    RadioButtonModule,
    TableModule,
  ],
  templateUrl: './admission.component.html',
  styleUrl: './admission.component.css',
})
export class AdmissionComponent implements OnInit {
  admissionForm!: FormGroup;

  patients: any[] = [];

  doctors: any[] = [];

  wards: any[] = [];

  rooms: any[] = [];

  filteredRooms: any[] = [];

  beds: any[] = [];

  filteredBeds: any[] = [];

  submitting = false;

  patientDialogVisible = false;

  patientSearchText = '';

  patientSearchLoading = false;

  patientSuggestions: any[] = [];

  searchSelectedPatient: any | null = null;

  selectedPatient: any | null = null;

  admissionTypeList = ADMISSION_TYPES;

  statusList = STATUS_LIST;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private staffService: StaffService,
    private ipdService: IpdService,
    private bedWardService: BedWardService,
    private patientService: PatientService,
  ) {}

  ngOnInit(): void {
    this.getAllDoctors();
    this.getAllWards();
    this.createForm();
  }

  createForm(): void {
    this.admissionForm = this.fb.group({
      patientId: [2, Validators.required],

      admissionDate: [new Date(), Validators.required],

      admissionType: ['PLANNED', Validators.required],

      status: ['ADMIT', Validators.required],

      reasonForAdmission: [
        '',
        [Validators.required, Validators.maxLength(500)],
      ],

      admittingDoctorId: [null, Validators.required],

      wardId: [null, Validators.required],

      roomId: [null, Validators.required],

      bedId: [null, Validators.required],

      chiefComplaint: ['', Validators.maxLength(1000)],

      initialNotes: ['', Validators.maxLength(2000)],
    });
  }

  getAllWards() {
    this.bedWardService.getAllWards().subscribe({
      next: (res: any) => {
        this.wards = res.data;
      },
      error: (error: any) => {},
    });
  }

  getAllDoctors() {
    this.staffService.getAllStaff().subscribe({
      next: (res: any) => {
        this.doctors = res?.data?.content ?? [];
      },
      error: (error: any) => {},
    });
  }

  searchPatientByKeyword(keyword: any) {
    this.patientService.searchPatientByKeyword(keyword).subscribe({
      next: (response: any) => {
        this.patientSearchLoading = false;

        const patients = response?.data ?? [];

        this.patientSuggestions.push(patients);
      },

      error: (error: any) => {
        this.patientSearchLoading = false;

        this.patientSuggestions = [];

        console.error('Patient search failed', error);
      },
    });
  }

  onWardChange(): void {
    const wardId = this.admissionForm.get('wardId')?.value;
    this.bedWardService.getRoomBaseOnWardId(wardId).subscribe({
      next: (res: any) => {
        this.rooms = res?.data ?? [];
      },
      error: (error: any) => {},
    });
  }

  onRoomChange(): void {
    const roomId = this.admissionForm.get('roomId')?.value;
    this.getAvailableBedsBasedOnRoomId(roomId);
  }

  getAvailableBedsBasedOnRoomId(roomId: any) {
    this.bedWardService.getAvailableBedsBasedOnRoomId(roomId).subscribe({
      next: (res: any) => {
        this.beds = res?.data ??[];
      },
      error: (error: any) => {},
    });
  }

  saveAdmission(): void {
    if (this.admissionForm.invalid) {
      this.admissionForm.markAllAsTouched();

      return;
    }

    this.submitting = true;

    const bedId = this.admissionForm.get('bedId')?.value;

    if (!bedId) {
      console.error('Bed is not selected');
      return;
    }

    const payloadForAdmission: Admission = {
      // patientId: this.selectedPatient.patientId,
      patientId: 1,

      admissionDate: this.admissionForm.get('admissionDate')?.value,
      admissionType: this.admissionForm.get('admissionType')?.value,
      status: this.admissionForm.get('status')?.value,
      reason: this.admissionForm.get('reasonForAdmission')?.value,
      admittingDoctorId: this.admissionForm.get('admittingDoctorId')?.value,
    };

    console.log('Create Admission Payload:', payloadForAdmission);

    this.createAdmission(payloadForAdmission, bedId);

    setTimeout(() => {
      this.submitting = false;
      this.router.navigate(['/main/ipd']);
    }, 800);
  }

  createAdmission(admissionPayload: Admission, bedId: number): void {
    this.ipdService.createAdmission(admissionPayload).subscribe({
      next: (response: any) => {
        console.log('Admission created successfully:', response);

        const admissionId = response?.data?.admissionId;

        if (!admissionId) {
          console.error('Admission ID not received from API response');
          this.submitting = false;
          return;
        }

        const bedAssignmentPayload: BedAssignment = {
          admissionId: admissionId,
          patientId: admissionPayload.patientId,
          bedId: bedId,
        };

        console.log('Create Bed Assignment Payload:', bedAssignmentPayload);

        this.createBedAssignment(bedAssignmentPayload);
      },

      error: (error: any) => {
        console.error('Admission creation failed:', error);

        this.submitting = false;
      },
    });
  }

  createBedAssignment(bedAssignmentPayload: BedAssignment): void {
    this.bedWardService.assignBedToPatient(bedAssignmentPayload).subscribe({
      next: (response: any) => {
        console.log('Bed assigned successfully:', response);

        this.submitting = false;

        this.router.navigate(['/main/ipd']);
      },

      error: (error: any) => {
        console.error('Bed assignment failed:', error);

        this.submitting = false;
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/main/ipd']);
  }

  isInvalid(controlName: string): boolean {
    const control = this.admissionForm.get(controlName);

    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  get selectedBed(): any | undefined {
    const bedId = this.admissionForm.get('bedId')?.value;

    return this.filteredBeds.find((bed) => bed.bedId === bedId);
  }

  openPatientSearch(): void {
    this.patientDialogVisible = true;

    this.patientSearchText = '';

    this.patientSuggestions = [];

    this.searchSelectedPatient = null;
  }

  searchPatients(): void {
    const searchValue = this.patientSearchText.trim();

    if (!searchValue) {
      return;
    }

    this.patientSearchLoading = true;

    this.patientSuggestions = [];

    this.searchSelectedPatient = null;

    this.patientService.searchPatientByKeyword(searchValue).subscribe({
      next: (response: any) => {
        this.patientSuggestions = response.data ?? [];

        if (this.patientSuggestions.length === 1) {
          this.searchSelectedPatient = this.patientSuggestions[0];
        }

        this.patientSearchLoading = false;
      },

      error: (error: any) => {
        console.error('Patient search failed', error);

        this.patientSuggestions = [];

        this.searchSelectedPatient = null;

        this.patientSearchLoading = false;
      },
    });
  }

  confirmPatientSelection(): void {
    if (!this.searchSelectedPatient) {
      return;
    }

    this.selectedPatient = this.searchSelectedPatient;

    this.admissionForm.patchValue({
      patientId: this.searchSelectedPatient.patientId,
    });

    this.patientDialogVisible = false;

    this.patientSearchText = '';

    this.patientSuggestions = [];

    this.searchSelectedPatient = null;
  }

  clearPatient(): void {
    this.selectedPatient = null;

    this.admissionForm.patchValue({
      patientId: null,
    });

    this.admissionForm.get('patientId')?.markAsTouched();
  }

  closePatientSearch(): void {
    this.patientDialogVisible = false;

    this.patientSearchText = '';

    this.patientSuggestions = [];

    this.searchSelectedPatient = null;
  }
}
