import { Component, inject, OnDestroy, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormGroup, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

import { DynamicFormComponent } from '../../../../shared/dynamic-form/dynamic-form.component';
import { DynamicFormConfig } from '../../../../core/models/dynamic-form.model';
import { PatientService } from '../../services/patient-service.service';
import { API_NAVIGATION } from '../../../../core/constants/api-endpoints';
import { Router } from '@angular/router';
import {
  addressFieldsConfig,
  contactPersonFieldsConfig,
  insuranceFieldsConfig,
  patientFieldsConfig,
  subscriberFieldsConfig,
  toIsoDate,
} from './patient-registration-form.config';

interface PatientDocument {
  documentType: string;
  label: string;
  file: File | null;
  fileName: string | null;
  previewUrl: string | null;
  existingDocumentId?: string | null;
}

const PATTERN_MESSAGES: Record<string, string> = {
  abhaNumber: 'must be exactly 14 digits',
  pincode: 'must be exactly 6 digits',
  patientMob: 'must be a valid mobile number (10-15 digits)',
  mobileNumber: 'must be a valid mobile number (10-15 digits)',
  mob: 'must be a valid mobile number (10-15 digits)',
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB per file
const MAX_TOTAL_SIZE = 100 * 1024 * 1024; // 100 MB per request (match BE max-request-size)
const ALLOWED_MIME_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];

function createInitialDocuments(): PatientDocument[] {
  const base = { file: null, fileName: null, previewUrl: null };
  return [
    { documentType: 'AADHAR_FRONT', label: 'AADHAR Front', ...base },
    { documentType: 'AADHAR_BACK', label: 'AADHAR Back', ...base },
    { documentType: 'PAN', label: 'PAN Card', ...base },
    { documentType: 'PASSPORT', label: 'Passport Photograph', ...base },
    { documentType: 'OTHER', label: 'Other Documents', ...base },
  ];
}

type ExistingPatient = Record<string, any>;

const STEP_PATIENT = { id: 1, label: 'Patient' };
const STEP_INSURANCE = { id: 2, label: 'Insurance' };
const STEP_DOCUMENTS = { id: 3, label: 'Documents' };

/** Handles "yyyy-MM-dd", ISO datetime strings and Jackson [y, m, d] arrays. */
function normalizeDate(value: unknown): string | null {
  if (Array.isArray(value) && value.length >= 3) {
    const [y, m, d] = value;
    return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  }
  return toIsoDate(value);
}

@Component({
  selector: 'app-patient-registration',
  standalone: true,
  imports: [CommonModule, DynamicFormComponent],
  templateUrl: './patient-registration.component.html',
  styleUrl: './patient-registration.component.css',
})
export class PatientRegistrationComponent implements OnDestroy {
  // readonly steps = [
  //   { id: 1, label: 'Patient' },
  //   { id: 2, label: 'Insurance' },
  //   { id: 3, label: 'Documents' },
  // ];

  currentStep = signal(1);
  submitting = signal(false);
  lookupLoading = signal(false);
  isEditMode = signal(false);

  stepErrors = signal<string[]>([]);
  errorTitle = signal('Please fix the following');
  successMessage = signal<string | null>(null);
  documentErrors = signal<Record<string, string>>({});

  patientForm!: FormGroup;
  permanentAddressForm!: FormGroup;
  communicationAddressForm: FormGroup | null = null;
  contactPersonForm!: FormGroup;
  subscriberForm: FormGroup | null = null;
  insuranceForm!: FormGroup;

  showSubscriber = true;
  communicationAddressSame = true;
  readonly router = inject(Router);

  private relationSub?: Subscription;

  private readonly DOCUMENT_TYPE_TO_API: Record<string, string> = {
    AADHAR_BACK: 'AADHAAR_BACK',
    AADHAR_FRONT: 'AADHAAR_FRONT',
    PAN: 'PAN',
    PASSPORT: 'PASSPORT',
    OTHER: 'OTHER',
  };

  private readonly REQUIRED_DOCUMENT_TYPES: string[] = [
    'AADHAR_FRONT',
    'AADHAR_BACK',
  ];

  documents = signal<PatientDocument[]>(createInitialDocuments());
  patientFieldsConfig = patientFieldsConfig;
  readonly steps: { id: number; label: string }[];
  private existingPatient: ExistingPatient | null = null;
  private patientId: number | null = null;
  addressFieldsConfig = addressFieldsConfig;
  contactPersonFieldsConfig = contactPersonFieldsConfig;
  subscriberFieldsConfig = subscriberFieldsConfig;
  insuranceFieldsConfig = insuranceFieldsConfig;

    constructor(private registrationService: PatientService) {
    const state: Record<string, any> =
      this.router.getCurrentNavigation()?.extras.state ?? history.state ?? {};

    // The list currently sends { patient: { patient: PatientModel } }, so unwrap both shapes.
    const raw = state['patient'];
    const patient: ExistingPatient | null = raw?.patient ?? raw ?? null;

    if (state['mode'] === 'edit') {
      if (patient?.['patientId'] == null) {
        // State was lost (e.g. direct URL hit) - nothing to edit.
        this.router.navigate([API_NAVIGATION.PATIENTS.LIST]);
      } else {
        this.existingPatient = patient;
        this.patientId = Number(patient['patientId']);
        this.isEditMode.set(true);
      }
    }

    this.steps = this.isEditMode()
      ? [STEP_PATIENT, STEP_INSURANCE]
      : [STEP_PATIENT, STEP_INSURANCE, STEP_DOCUMENTS];

    this.patientFieldsConfig = this.isEditMode()
      ? this.buildEditPatientConfig()
      : patientFieldsConfig;
  }

  /** Edit-only copy of the config (shared config is not mutated) with a read-only MR number. */
  private buildEditPatientConfig(): DynamicFormConfig {
    const fields = [...patientFieldsConfig.fields];
    const abhaIndex = fields.findIndex((f) => f.name === 'abhaNumber');

    fields.splice(abhaIndex + 1, 0, {
      name: 'patientMrNumber',
      label: 'MR Number',
      type: 'text',
      col: 'col-12 col-md-6',
      validators: [],
    } as (typeof fields)[number]);

    return { ...patientFieldsConfig, fields };
  }

    // ---------- edit-mode hydration ----------

  private hydrate(
    form: FormGroup | null,
    value: Record<string, any> | null | undefined,
    dateKeys: string[] = [],
  ): void {
    if (!form || !value) {
      return;
    }

    const data: Record<string, any> = { ...value };
    dateKeys.forEach((key) => (data[key] = normalizeDate(data[key])));

    // patchValue ignores keys the form does not have.
    form.patchValue(data, { emitEvent: false });
    form.markAsPristine();
  }

  private hydratePatientForm(form: FormGroup): void {
    const p = this.existingPatient;
    if (!p) {
      return;
    }

    this.communicationAddressSame = p['isCommAddressSameAsCardAddress'] ?? true;

    this.hydrate(
      form,
      {
        ...p,
        isChildRegistration: p['isChildRegistration'] ?? false,
        isCommAddressSameAsCardAddress: this.communicationAddressSame,
      },
      ['patientDob'],
    );

    // ABHA number and MR number are immutable once registered.
    form.get('abhaNumber')?.disable({ emitEvent: false });
    form.get('patientMrNumber')?.disable({ emitEvent: false });

    // Relation was patched silently, so apply subscriber visibility explicitly.
    this.updateSubscriberVisibility(form.get('relation')?.value);
  }

  private restoreExistingValues(): void {
    const p = this.existingPatient;
    if (!p) {
      return;
    }
    if (this.patientForm) {
      this.hydratePatientForm(this.patientForm);
    }
    this.hydrate(this.permanentAddressForm, p['patientAddress']);
    this.hydrate(this.communicationAddressForm, p['patientCommAddress']);
    this.hydrate(this.contactPersonForm, p['contactPerson']);
    this.hydrate(this.subscriberForm, p['subscriber'], ['dob']);
    this.hydrate(this.insuranceForm, this.getExistingPolicy(), [
      'policyStartDate',
      'policyEndDate',
      'insuranceBenefitStartDate',
      'insuranceBenefitEndDate',
    ]);
  }

  private getExistingPolicy(): Record<string, any> | null {
    const p = this.existingPatient;
    return p?.['patientPolicyDetails'] ?? p?.['policyDetails'] ?? null;
  }

  
  ngOnDestroy(): void {
    this.relationSub?.unsubscribe();
    this.revokeAllPreviews();
  }

  onPatientFormReady(form: FormGroup): void {
    this.patientForm = form;

    this.communicationAddressSame =
      form.get('isCommAddressSameAsCardAddress')?.value ?? true;

    this.updateSubscriberVisibility(form.get('relation')?.value);

    this.relationSub?.unsubscribe();
    this.relationSub = form
      .get('relation')
      ?.valueChanges.subscribe((relation) => {
        this.updateSubscriberVisibility(relation);
      });

    if (this.existingPatient) {
      Promise.resolve().then(() => this.hydratePatientForm(form));
    }
  }

  private updateSubscriberVisibility(relation: string | null): void {
    this.showSubscriber = relation !== 'SELF';

    if (relation === 'SELF') {
      this.subscriberForm?.reset();
      this.subscriberForm = null;
    }
  }

  onPermanentAddressReady(form: FormGroup): void {
    this.permanentAddressForm = form;
    if (this.existingPatient) {
      Promise.resolve().then(() =>
        this.hydrate(form, this.existingPatient!['patientAddress']),
      );
    }
  }

  onCommunicationAddressReady(form: FormGroup): void {
    this.communicationAddressForm = form;
    if (this.existingPatient) {
      Promise.resolve().then(() =>
        this.hydrate(form, this.existingPatient!['patientCommAddress']),
      );
    }
  }

  onContactPersonReady(form: FormGroup): void {
    this.contactPersonForm = form;
    if (this.existingPatient) {
      Promise.resolve().then(() =>
        this.hydrate(form, this.existingPatient!['contactPerson']),
      );
    }
  }

  onSubscriberReady(form: FormGroup): void {
    this.subscriberForm = form;
    if (this.existingPatient) {
      Promise.resolve().then(() =>
        this.hydrate(form, this.existingPatient!['subscriber'], ['dob']),
      );
    }
  }

  onInsuranceFormReady(form: FormGroup): void {
    this.insuranceForm = form;
    if (this.existingPatient) {
      Promise.resolve().then(() =>
        this.hydrate(form, this.getExistingPolicy(), [
          'policyStartDate',
          'policyEndDate',
          'insuranceBenefitStartDate',
          'insuranceBenefitEndDate',
        ]),
      );
    }
  }

  onPatientFormChanged(value: Record<string, any>): void {
    this.communicationAddressSame =
      value['isCommAddressSameAsCardAddress'] ?? true;
  }

  next(): void {
    this.clearMessages();
    const step = this.currentStep();

    if (step === 1 && !this.validateStepOne()) {
      return;
    }

    if (step === 2 && !this.validateInsurance()) {
      return;
    }

    if (step < this.steps.length) {
      this.currentStep.set(step + 1);
    }
  }

  previous(): void {
    if (this.currentStep() > 1 && !this.submitting()) {
      this.clearMessages();
      this.currentStep.update((step) => step - 1);
    }
  }

  private clearMessages(): void {
    this.stepErrors.set([]);
    this.successMessage.set(null);
  }

  private showErrors(
    errors: string[],
    title = 'Please fix the following',
  ): void {
    this.errorTitle.set(title);
    this.stepErrors.set(errors);

    if (errors.length) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  private hasAnyValue(form: FormGroup | null): boolean {
    if (!form) {
      return false;
    }

    return Object.values(form.getRawValue()).some(
      (value) =>
        value !== null &&
        value !== undefined &&
        (typeof value !== 'string' || value.trim() !== ''),
    );
  }

  private isEmpty(value: unknown): boolean {
    return (
      value === null ||
      value === undefined ||
      (typeof value === 'string' && value.trim() === '')
    );
  }

  private requireIfEmpty(form: FormGroup, controlName: string): void {
    const control = form.get(controlName);

    if (control && this.isEmpty(control.value)) {
      control.setErrors({ ...(control.errors ?? {}), required: true });
    }
  }

  private checkDateOrder(
    form: FormGroup,
    startName: string,
    endName: string,
    startLabel: string,
  ): void {
    const start = toIsoDate(form.get(startName)?.value);
    const endControl = form.get(endName);
    const end = toIsoDate(endControl?.value);

    if (start && end && endControl && end < start) {
      endControl.setErrors({
        ...(endControl.errors ?? {}),
        dateOrder: `must be on or after ${startLabel}`,
      });
    }
  }

  private describeControlError(name: string, errors: ValidationErrors): string {
    if (errors['required']) {
      return 'is required';
    }
    if (errors['pattern']) {
      return PATTERN_MESSAGES[name] ?? 'has an invalid format';
    }
    if (errors['maxlength']) {
      return `must be at most ${errors['maxlength'].requiredLength} characters`;
    }
    if (errors['futureDate']) {
      return 'cannot be in the future';
    }
    if (typeof errors['dateOrder'] === 'string') {
      return errors['dateOrder'];
    }
    return 'is invalid';
  }

  /**
   * Re-runs each control's own validators (clearing stale manual errors),
   * applies optional cross-field rules, and returns readable messages.
   */
  private validateForm(
    form: FormGroup | null,
    config: DynamicFormConfig,
    section: string,
    crossFieldRules?: () => void,
  ): string[] {
    if (!form) {
      return [`${section} form is not ready. Please reload the page.`];
    }

    Object.values(form.controls).forEach((control) =>
      control.updateValueAndValidity({ onlySelf: true, emitEvent: false }),
    );

    crossFieldRules?.();
    form.updateValueAndValidity({ emitEvent: false });

    const messages: string[] = [];

    for (const field of config.fields) {
      const control = form.get(field.name);

      if (control && control.invalid && control.errors) {
        control.markAsTouched();
        messages.push(
          `${section}: ${field.label} ${this.describeControlError(field.name, control.errors)}`,
        );
      }
    }

    if (messages.length) {
      form.markAllAsTouched();
    }

    return messages;
  }

  private validateStepOne(): boolean {
    const errors: string[] = [];

    errors.push(
      ...this.validateForm(
        this.patientForm,
        this.patientFieldsConfig,
        'Patient',
        () => {
          const isChild =
            this.patientForm?.get('isChildRegistration')?.value === true;

          if (isChild) {
            this.requireIfEmpty(this.patientForm, 'patientDob');
          }
        },
      ),
    );

    errors.push(
      ...this.validateForm(
        this.permanentAddressForm,
        this.addressFieldsConfig,
        'Permanent address',
      ),
    );

    if (!this.communicationAddressSame) {
      errors.push(
        ...this.validateForm(
          this.communicationAddressForm,
          this.addressFieldsConfig,
          'Communication address',
        ),
      );
    }

    errors.push(
      ...this.validateForm(
        this.contactPersonForm,
        this.contactPersonFieldsConfig,
        'Contact person',
        () => {
          if (this.hasAnyValue(this.contactPersonForm)) {
            this.requireIfEmpty(this.contactPersonForm, 'name');
          }
        },
      ),
    );

    if (this.showSubscriber) {
      errors.push(
        ...this.validateForm(
          this.subscriberForm,
          this.subscriberFieldsConfig,
          'Subscriber',
        ),
      );
    }

    this.showErrors(errors);
    return errors.length === 0;
  }

  private hasInsuranceData(): boolean {
    return this.hasAnyValue(this.insuranceForm);
  }

  private validateInsurance(): boolean {
    if (!this.insuranceForm || !this.hasInsuranceData()) {
      this.insuranceForm?.markAsUntouched();
      this.showErrors([]);
      return true;
    }

    const errors = this.validateForm(
      this.insuranceForm,
      this.insuranceFieldsConfig,
      'Insurance',
      () => {
        this.requireIfEmpty(this.insuranceForm, 'insuranceCompanyName');
        this.requireIfEmpty(this.insuranceForm, 'policyNumber');

        this.checkDateOrder(
          this.insuranceForm,
          'policyStartDate',
          'policyEndDate',
          'Policy Start Date',
        );
        this.checkDateOrder(
          this.insuranceForm,
          'insuranceBenefitStartDate',
          'insuranceBenefitEndDate',
          'Insurance Benefit Start Date',
        );
      },
    );

    this.showErrors(errors);
    return errors.length === 0;
  }

  getDocumentHint(documentType: string): string {
    const hints: Record<string, string> = {
      AADHAR_BACK: 'Upload Aadhaar card back side.',
      AADHAR_FRONT: 'Upload Aadhaar card front side.',
      PAN_CARD: 'Upload PAN card.',
      PASSPORT_PHOTO: 'Upload patient photograph (JPG or PNG).',
      OTHER: 'Upload additional supporting documents.',
    };

    return hints[documentType] || 'Upload supporting document.';
  }

  getDocumentError(documentType: string): string | null {
    return this.documentErrors()[documentType] ?? null;
  }

  private setDocumentError(documentType: string, message: string | null): void {
    this.documentErrors.update((errors) => {
      const updated = { ...errors };

      if (message) {
        updated[documentType] = message;
      } else {
        delete updated[documentType];
      }

      return updated;
    });
  }

  private getFileError(file: File, documentType: string): string | null {
    const imageOnly = documentType === 'PASSPORT_PHOTO';
    const allowedExtensions = imageOnly
      ? ['jpg', 'jpeg', 'png']
      : ['pdf', 'jpg', 'jpeg', 'png'];
    const typeMessage = imageOnly
      ? 'Only JPG, JPEG and PNG images are allowed.'
      : 'Only PDF, JPG, JPEG and PNG files are allowed.';

    const extension = file.name.split('.').pop()?.toLowerCase() ?? '';

    if (!allowedExtensions.includes(extension)) {
      return typeMessage;
    }

    if (file.type && !ALLOWED_MIME_TYPES.includes(file.type)) {
      return typeMessage;
    }

    if (imageOnly && file.type === 'application/pdf') {
      return typeMessage;
    }

    if (file.size === 0) {
      return 'The selected file is empty.';
    }

    if (file.size > MAX_FILE_SIZE) {
      return 'File size must not exceed 10 MB.';
    }

    return null;
  }

  onFileSelected(event: Event, documentType: string): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    const error = this.getFileError(file, documentType);
    input.value = '';

    if (error) {
      this.setDocumentError(documentType, error);
      return;
    }

    this.setDocumentError(documentType, null);

    this.documents.update((docs) =>
      docs.map((doc) => {
        if (doc.documentType !== documentType) {
          return doc;
        }

        if (doc.previewUrl) {
          URL.revokeObjectURL(doc.previewUrl);
        }

        const previewUrl = file.type.startsWith('image/')
          ? URL.createObjectURL(file)
          : null;

        return {
          ...doc,
          file,
          fileName: file.name,
          previewUrl,
          existingDocumentId: null,
        };
      }),
    );
  }

  removeDocument(documentType: string): void {
    this.setDocumentError(documentType, null);

    this.documents.update((docs) =>
      docs.map((doc) => {
        if (doc.documentType !== documentType) {
          return doc;
        }

        if (doc.previewUrl) {
          URL.revokeObjectURL(doc.previewUrl);
        }

        return {
          ...doc,
          file: null,
          fileName: null,
          previewUrl: null,
          existingDocumentId: null,
        };
      }),
    );
  }

  private revokeAllPreviews(): void {
    this.documents().forEach((doc) => {
      if (doc.previewUrl) {
        URL.revokeObjectURL(doc.previewUrl);
      }
    });
  }

  private validateDocuments(): boolean {
    this.documentErrors.set({});

    const docs = this.documents();

    const hasFile = (type: string) =>
      !!docs.find((doc) => doc.documentType === type)?.file;

    let valid = true;

    // Required documents
    this.REQUIRED_DOCUMENT_TYPES.forEach((type) => {
      if (!hasFile(type)) {
        const doc = docs.find((d) => d.documentType === type);

        this.setDocumentError(type, `${doc?.label ?? type} is required.`);

        valid = false;
      }
    });

    // Aadhaar front/back
    if (hasFile('AADHAR_FRONT') !== hasFile('AADHAR_BACK')) {
      const missing = hasFile('AADHAR_FRONT') ? 'AADHAR_BACK' : 'AADHAR_FRONT';

      this.setDocumentError(
        missing,
        'This document is required when the other Aadhaar side is uploaded.',
      );

      valid = false;
    }

    // Individual file validation
    docs.forEach((doc) => {
      if (!doc.file) return;

      const error = this.getFileError(doc.file, doc.documentType);

      if (error) {
        this.setDocumentError(doc.documentType, error);
        valid = false;
      }
    });

    // Total file size
    const totalSize = docs.reduce((sum, doc) => sum + (doc.file?.size ?? 0), 0);

    if (totalSize > MAX_TOTAL_SIZE) {
      docs
        .filter((doc) => doc.file)
        .forEach((doc) => {
          this.setDocumentError(
            doc.documentType,
            'Total document upload size exceeds the allowed limit.',
          );
        });

      valid = false;
    }

    return valid;
  }

  private buildPatientDetails(): Record<string, unknown> {
    const patient = this.patientForm.getRawValue();
    const permanentAddress = this.permanentAddressForm.getRawValue();

    const communicationAddress = this.communicationAddressSame
      ? permanentAddress
      : this.communicationAddressForm?.getRawValue();

    return {
      ...(this.isEditMode() && {
        patientId: this.patientId,
        patientMrNumber: this.existingPatient?.['patientMrNumber'],
      }),
      abhaNumber: patient.abhaNumber,
      patientName: patient.patientName,
      patientDob: toIsoDate(patient.patientDob),
      patientMob: patient.patientMob,
      gender: patient.gender,
      relation: patient.relation,
      isCommAddressSameAsCardAddress: this.communicationAddressSame,
      isChildRegistration: patient.isChildRegistration ?? false,
      patientAddress: permanentAddress,
      patientCommAddress: communicationAddress,
      contactPerson: this.hasAnyValue(this.contactPersonForm)
        ? this.contactPersonForm.getRawValue()
        : null,
      subscriber:
        patient.relation === 'SELF' || !this.subscriberForm
          ? null
          : this.subscriberForm.getRawValue(),
    };
  }

  private buildPolicyDetails(): Record<string, unknown> | null {
    return this.hasInsuranceData() ? this.insuranceForm.getRawValue() : null;
  }

  private appendFormValue(
    formData: FormData,
    key: string,
    value: unknown,
  ): void {
    if (value === null || value === undefined) {
      return;
    }

    if (value instanceof Date) {
      const iso = toIsoDate(value);
      if (iso) {
        formData.append(key, iso);
      }
      return;
    }

    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (trimmed) {
        formData.append(key, trimmed);
      }
      return;
    }

    if (typeof value === 'boolean' || typeof value === 'number') {
      formData.append(key, String(value));
      return;
    }

    if (Array.isArray(value)) {
      value.forEach((item, index) =>
        this.appendFormValue(formData, `${key}[${index}]`, item),
      );
      return;
    }

    if (typeof value === 'object') {
      Object.entries(value as Record<string, unknown>).forEach(
        ([prop, child]) =>
          this.appendFormValue(formData, `${key}.${prop}`, child),
      );
    }
  }

  private buildFormData(): FormData {
    const formData = new FormData();

    const patientDetails = this.buildPatientDetails();

    formData.append(
      'patientDetails',
      new Blob([JSON.stringify(patientDetails)], { type: 'application/json' }),
    );

    const policy = this.buildPolicyDetails();

    if (policy) {
      formData.append(
        'patientPolicyDetails',
        new Blob([JSON.stringify(policy)], { type: 'application/json' }),
      );
    }

    const selectedDocuments = this.documents().filter(
      (doc) => doc.file !== null,
    );

    const filesMap = new Map<string, File>();

    const documentsMeta = selectedDocuments.map((doc, index) => {
      const id = `a${index + 1}`;

      filesMap.set(id, doc.file!);

      return {
        id: id,
        documentType: this.DOCUMENT_TYPE_TO_API[doc.documentType],
      };
    });

    formData.append(
      'documentsJson',
      new Blob([JSON.stringify(documentsMeta)], { type: 'application/json' }),
    );

    filesMap.forEach((file, id) => {
      formData.append(id, file, file.name);
    });

    return formData;
  }

  submitRegistration(): void {
    if (this.submitting()) {
      return;
    }

    this.clearMessages();

    if (!this.validateStepOne()) {
      this.currentStep.set(1);
      return;
    }

    if (!this.validateInsurance()) {
      this.currentStep.set(2);
      return;
    }

    if (!this.validateDocuments()) {
      this.currentStep.set(3);
      return;
    }

    const formData = this.buildFormData();

    this.submitting.set(true);

    this.registrationService.createPatient(formData).subscribe({
      next: () => {
        this.submitting.set(false);
        this.resetAll();
        this.successMessage.set('Patient registration completed successfully.');
        alert('Patient registration completed successfully.');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },

      error: (error: HttpErrorResponse) => {
        this.submitting.set(false);
        this.showErrors(
          this.extractErrorMessages(error),
          'Registration failed',
        );
      },
    });
  }

  private extractErrorMessages(error: HttpErrorResponse): string[] {
    if (error.status === 0) {
      return [
        'Unable to reach the server. Check your connection and try again.',
      ];
    }

    const body = error.error;
    const messages: string[] = [];
    const list = body?.errors ?? body?.data?.errors;

    if (Array.isArray(list)) {
      list.forEach((item: any) => {
        if (typeof item === 'string') {
          messages.push(item);
          return;
        }

        const text = item?.defaultMessage ?? item?.message;
        if (text) {
          messages.push(item?.field ? `${item.field}: ${text}` : text);
        }
      });
    } else if (list && typeof list === 'object') {
      Object.entries(list).forEach(([field, message]) =>
        messages.push(`${field}: ${message}`),
      );
    }

    if (!messages.length && typeof body?.message === 'string' && body.message) {
      messages.push(body.message);
    }

    if (!messages.length) {
      const byStatus: Record<number, string> = {
        400: 'The server rejected the request. Please check the entered details.',
        401: 'Your session has expired. Please sign in again.',
        403: 'You do not have permission to register patients.',
        413: 'The uploaded files are too large for the server.',
        415: 'The server did not accept this request format.',
        500: 'Something went wrong on the server. Please try again later.',
      };

      messages.push(
        byStatus[error.status] ??
          'Patient registration failed. Please try again.',
      );
    }

    return messages;
  }

  cancel(): void {
    this.router.navigate([API_NAVIGATION.PATIENTS.LIST]);
  }

  reset(): void {
    if (this.submitting()) {
      return;
    }

    if (!confirm('Discard this registration and clear all entered data?')) {
      return;
    }

    this.resetAll();
  }

  private resetAll(): void {

     if (this.isEditMode()) {
      this.clearMessages();
      this.restoreExistingValues();
      this.currentStep.set(1);
      return;
    }
    
    this.revokeAllPreviews();
    this.documents.set(createInitialDocuments());
    this.documentErrors.set({});
    this.clearMessages();

    this.communicationAddressSame = true;

    this.patientForm?.reset({
      isCommAddressSameAsCardAddress: true,
      isChildRegistration: false,
    });
    this.permanentAddressForm?.reset();
    this.communicationAddressForm?.reset();
    this.contactPersonForm?.reset();
    this.subscriberForm?.reset();
    this.insuranceForm?.reset();

    this.currentStep.set(1);
  }

  goToStep(step: number): void {
    if (step < this.currentStep()) {
      this.currentStep.set(step);
    }
  }

    submitUpdate(): void {
    if (this.submitting() || this.patientId == null) {
      return;
    }

    this.clearMessages();

    if (!this.validateStepOne()) {
      this.currentStep.set(1);
      return;
    }

    if (!this.validateInsurance()) {
      this.currentStep.set(2);
      return;
    }

    const payload = {
      patientDetails: this.buildPatientDetails(),
      patientPolicyDetails: this.buildPolicyDetails(),
    };

    this.submitting.set(true);

    this.registrationService.updatePatient(this.patientId, payload).subscribe({
      next: () => {
        this.submitting.set(false);
        alert('Patient details updated successfully.');
        this.router.navigate([API_NAVIGATION.PATIENTS.LIST]);
      },
      error: (error: HttpErrorResponse) => {
        this.submitting.set(false);
        this.showErrors(this.extractErrorMessages(error), 'Update failed');
      },
    });
  }
}
