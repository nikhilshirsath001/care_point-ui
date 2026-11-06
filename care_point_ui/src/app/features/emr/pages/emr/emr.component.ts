import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import {SharedTableComponent, TableColumn} from '../../../../shared/shared-table/shared-table.component';
import { ClinicalRecordFormComponent } from '../../components/clinical-record-form/clinical-record-form.component';
import { EmrService } from '../../services/emr.service';

type EmrSection =| 'clinical-records'| 'diagnosis'| 'procedures' | 'medications';

@Component({
  selector: 'app-emr',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    DialogModule,
    SharedTableComponent,
    ClinicalRecordFormComponent
  ],
  templateUrl: './emr.component.html',
  styleUrl: './emr.component.css'
})
export class EmrComponent implements OnInit {

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly emrService = inject(EmrService);

  selectedPatient: any = null;
  selectedPatientId: number | null = null;

  loading = false;
  errorMessage = '';

  activeSection: EmrSection = 'clinical-records';

  medicalRecords: any[] = [];
  diagnoses: any[] = [];
  procedures: any[] = [];
  prescriptions: any[] = [];
  medicationRows: any[] = [];

  doctorNames: Record<number, string> = {};
  diagnosisDetails: Record<number, string> = {};

  clinicalRecordColumns: TableColumn[] = [
    { field: 'visitId', header: 'Visit ID' },
    { field: 'recordDate', header: 'Date', type: 'date' },
    { field: 'doctorName', header: 'Doctor Name' },
    { field: 'symptoms', header: 'Symptoms' },
    { field: 'diagnosisName', header: 'Diagnosis' },
    { field: 'treatment', header: 'Treatment' },
    { field: 'notes', header: 'Clinical Notes' }
  ];

  diagnosisColumns: TableColumn[] = [
    { field: 'diagnosisName', header: 'Diagnosis Name' },
    { field: 'diagnosisCode', header: 'Code' },
    { field: 'description', header: 'Description' }
  ];

  procedureColumns: TableColumn[] = [
    { field: 'procedureId', header: 'Procedure ID' },
    { field: 'procedureName', header: 'Procedure' },
    { field: 'procedureDate', header: 'Date', type: 'date' },
    { field: 'remark', header: 'Remarks' }
  ];

  medicationColumns: TableColumn[] = [
    { field: 'prescriptionId', header: 'Prescription ID' },
    { field: 'medicationName', header: 'Medication' },
    { field: 'dosage', header: 'Dosage' },
    { field: 'frequency', header: 'Frequency' },
    { field: 'duration', header: 'Duration' }
  ];

  tableConfig: any = {
    searchable: false,
    paginator: true,
    rows: 10,
    rowsPerPageOptions: [10, 20, 50],
    exportable: true,
    showRefresh: true,
    loading: false,
    emptyMessage: 'No records found'
  };

  ngOnInit(): void {
    const patientId = Number(this.route.snapshot.paramMap.get('patientId'));

    if (!Number.isInteger(patientId) || patientId <= 0) {
      this.goBack();
      return;
    }

    this.selectedPatientId = patientId;
    this.selectedPatient = history.state?.patient ?? null;

    // Always fetch patient details instead of relying only on navigation state
    this.loadPatientDetails(patientId);
  }

  // Age shown in the patient card, calculated from dateOfBirth
  get patientAge(): number | string {
    const dob = this.selectedPatient?.dateOfBirth;
    if (!dob) return '-';

    const birth = new Date(dob);
    const today = new Date();
    if (isNaN(birth.getTime()) || birth > today) return '-';

    let age = today.getFullYear() - birth.getFullYear();
    const passed =
      today.getMonth() > birth.getMonth() ||
      (today.getMonth() === birth.getMonth() &&
        today.getDate() >= birth.getDate());

    return passed ? age : age - 1;
  }

  private extractRows(response: any): any[] {
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

  private loadPatientDetails(patientId: number): void {
    this.loading = true;
    this.errorMessage = '';

    this.emrService.getPatientById(patientId).subscribe({
      next: (response: any) => {
        console.log('Patient Details API Response:', response); // check the real keys here

        const patient =
          response?.data?.patient ??
          response?.data?.patientDetails ??
          response?.data ??
          response?.patient ??
          response;

        if (!patient) {
          this.loading = false;
          this.errorMessage = 'Patient details could not be found.';
          this.loadMedicalRecords(patientId);
          return;
        }

        const pick = (obj: any, keys: string[]) => {
          for (const key of keys) {
            const v = obj?.[key];
            if (v !== null && v !== undefined && v !== '') return v;
          }
          return null;
        };

        const first = pick(patient, ['firstName', 'first_name', 'patientFirstName', 'fname']);
        const middle = pick(patient, ['middleName', 'middle_name']);
        const last = pick(patient, ['lastName', 'last_name', 'patientLastName', 'lname']);

        let dob = pick(patient, [
          'dateOfBirth', 'dob', 'birthDate', 'date_of_birth', 'patientDob'
        ]);
        if (!dob && patient.yearOfBirth) {
          const m = String(patient.monthOfBirth ?? 1).padStart(2, '0');
          const d = String(patient.dayOfBirth ?? 1).padStart(2, '0');
          dob = `${patient.yearOfBirth}-${m}-${d}`;
        }

        const incoming: any = {
          patientId: pick(patient, ['patientId', 'id']) ?? patientId,
          patientName:
            [first, middle, last].filter(Boolean).join(' ') ||
            pick(patient, ['patientName', 'fullName', 'name']),
          abhaId: pick(patient, [
            'abhaId', 'abhaNumber', 'abhaAddress', 'abha_id',
            'healthIdNumber', 'healthId'
          ]),
          gender: pick(patient, ['gender', 'patientGender', 'sex', 'genderCode']),
          bloodGroup: pick(patient, ['bloodGroup', 'blood_group', 'bloodType']),
          dateOfBirth: dob,
          phone: pick(patient, [
            'phone', 'mobileNumber', 'patientMob', 'mobile', 'contactNumber'
          ])
        };

        const existing = this.selectedPatient ?? {};
        const merged: any = { ...existing, ...patient };

        // Restore existing values wherever the fetched value is empty
        Object.keys(existing).forEach(k => {
          const v = merged[k];
          if (v === null || v === undefined || v === '') {
            merged[k] = existing[k];
          }
        });

        // Then apply normalized values when they have real data
        Object.entries(incoming).forEach(([k, v]) => {
          if (v !== null && v !== undefined && v !== '') merged[k] = v;
        });

        this.selectedPatient = merged;
        this.loading = false;
        this.loadMedicalRecords(patientId);
      },
      error: (error: any) => {
        console.error('Failed to load patient details:', error);
        this.loading = false;
        this.errorMessage = 'Unable to load patient details.';
        // navigation-state patient (if any) stays visible; still load records
        this.loadMedicalRecords(patientId);
      }
    });
  }

  get clinicalRecordRows(): any[] {
    return this.medicalRecords.map((record: any) => {
      const doctorId = Number(record.doctorEmployeeNo ?? record.doctorId);
      const diagnosisId = Number(record.diagnosisId);

      return {
        ...record,

        visitId:
          record.visitId ??
          record.patientVisitId ??
          record.visit?.visitId ??
          '-',

        recordId:
          record.recordId ??
          record.medicalRecordId ??
          record.id ??
          '-',

        recordDate:
          record.recordDate ??
          record.createdAt ??
          record.visitDate ??
          null,

        doctorName:
          record.doctorName ??
          record.doctor?.name ??
          (
            [record.doctor?.firstName, record.doctor?.lastName]
              .filter(Boolean)
              .join(' ') ||
            this.doctorNames[doctorId] ||
            '-'
          ),

        diagnosisName:
          record.diagnosisName ??
          record.diagnosis?.diagnosisName ??
          this.diagnosisDetails[diagnosisId] ??
          '-',

        notes:
          record.notes ??
          record.clinicalNotes ??
          record.description ??
          '-'
      };
    });
  }

  get diagnosisRows(): any[] {
    return this.diagnoses.map((diagnosis: any) => ({
      diagnosisName: diagnosis.diagnosisName ?? diagnosis.name ?? '-',
      diagnosisCode: diagnosis.diagnosisCode ?? diagnosis.code ?? '-',
      description: diagnosis.description ?? '-'
    }));
  }

  get procedureRows(): any[] {
    return this.procedures.map((procedure: any) => ({
      ...procedure,
      procedureId: procedure.procedureId ?? procedure.id ?? '-',
      procedureName:
        procedure.procedureName ??
        procedure.name ??
        procedure.description ??
        '-',
      procedureDate: procedure.procedureDate ?? procedure.createdAt ?? null,
      remark:
        procedure.remarks ??
        procedure.remark ??
        procedure.procedureRemark ??
        '-'
    }));
  }

  loadMedicalRecords(patientId: number): void {
    this.loading = true;
    this.errorMessage = '';

    this.emrService.getMedicalRecordsByPatient(patientId).subscribe({
      next: (response: any) => {
        console.log('Clinical Records API Response:', response);

        this.medicalRecords = this.extractRows(response);

        this.loading = false;
        this.loadDoctorNames();
        this.loadRelatedClinicalData();
      },
      error: (error: any) => {
        console.error('Failed to load clinical records:', error);
        this.medicalRecords = [];
        this.loading = false;
        this.errorMessage = 'Unable to load clinical records.';
      }
    });
  }

  private loadRelatedClinicalData(): void {
    if (!this.selectedPatientId) {
      return;
    }

    this.loadDiagnoses(this.selectedPatientId);
    this.loadProcedures(this.selectedPatientId);
    this.loadPrescriptions(this.selectedPatientId);
  }

  private loadDoctorNames(): void {
    const doctorIds = [
      ...new Set(
        this.medicalRecords
          .map((record: any) =>
            Number(record.doctorEmployeeNo ?? record.doctorId)
          )
          .filter((id: number) => Number.isFinite(id) && id > 0)
      )
    ];

    doctorIds.forEach(doctorId => {
      this.emrService.getStaffById(doctorId).subscribe({
        next: (response: any) => {
          const doctor = response?.data ?? response;

          this.doctorNames[doctorId] =
            doctor?.name ??
            (
              [doctor?.firstName, doctor?.lastName]
                .filter(Boolean)
                .join(' ') || '-'
            );

          this.doctorNames = { ...this.doctorNames };
        },
        error: (error: any) => {
          console.error(`Failed to load doctor ${doctorId}:`, error);
          this.doctorNames[doctorId] = '-';
          this.doctorNames = { ...this.doctorNames };
        }
      });
    });
  }

  loadDiagnoses(patientId: number): void {
    this.emrService.getDiagnosesByPatient(patientId).subscribe({
      next: (response: any) => {
        this.diagnoses = this.extractRows(response);

        this.diagnoses.forEach((diagnosis: any) => {
          const diagnosisId = Number(diagnosis.diagnosisId ?? diagnosis.id);

          if (!diagnosisId) {
            return;
          }

          const name = diagnosis.diagnosisName ?? diagnosis.name;

          if (name) {
            this.diagnosisDetails[diagnosisId] = name;
            this.diagnosisDetails = { ...this.diagnosisDetails };
            return;
          }

          this.emrService.getDiagnosisById(diagnosisId).subscribe({
            next: (detailResponse: any) => {
              const detail = detailResponse?.data ?? detailResponse;

              this.diagnosisDetails[diagnosisId] =
                detail?.diagnosisName ??
                detail?.name ??
                detail?.description ??
                '-';

              this.diagnosisDetails = { ...this.diagnosisDetails };
            },
            error: () => {
              this.diagnosisDetails[diagnosisId] = '-';
              this.diagnosisDetails = { ...this.diagnosisDetails };
            }
          });
        });
      },
      error: (error: any) => {
        console.error('Failed to load diagnoses:', error);
        this.diagnoses = [];
      }
    });
  }

  loadProcedures(patientId: number): void {
    this.emrService.getProceduresByPatient(patientId).subscribe({
      next: (response: any) => {
        this.procedures = this.extractRows(response);
      },
      error: (error: any) => {
        console.error('Failed to load procedures:', error);
        this.procedures = [];
      }
    });
  }

  loadPrescriptions(patientId: number): void {
    this.emrService.getPrescriptionsByPatient(patientId).subscribe({
      next: (response: any) => {
        this.prescriptions = this.extractRows(response);

        this.medicationRows = this.prescriptions.flatMap(
          (prescription: any) => {
            const items = Array.isArray(prescription.items)
              ? prescription.items
              : [];

            return items.map((item: any) => ({
              prescriptionId:
                prescription.prescriptionId ?? prescription.id ?? '-',
              medicationName:
                item.medicationName ??
                item.medication?.name ??
                item.name ??
                '-',
              dosage: item.dosage ?? '-',
              frequency: item.frequency ?? '-',
              duration: item.duration ?? '-'
            }));
          }
        );
      },
      error: (error: any) => {
        console.error('Failed to load patient prescriptions:', error);
        this.prescriptions = [];
        this.medicationRows = [];
      }
    });
  }

  changeSection(section: EmrSection): void {
    this.activeSection = section;

    if (!this.selectedPatientId) {
      return;
    }

    switch (section) {
      case 'clinical-records':
        this.loadMedicalRecords(this.selectedPatientId);
        break;
      case 'diagnosis':
        this.loadDiagnoses(this.selectedPatientId);
        break;
      case 'procedures':
        this.loadProcedures(this.selectedPatientId);
        break;
      case 'medications':
        this.loadPrescriptions(this.selectedPatientId);
        break;
    }
  }

  refreshCurrentSection(): void {
    if (!this.selectedPatientId) {
      return;
    }

    this.changeSection(this.activeSection);
  }

  

  goBack(): void {
    this.router.navigate(['/main/emr']);
  }
}