import { Validators } from '@angular/forms';
import { DynamicFormConfig } from '../../../core/models/dynamic-form.model';

export const DISCHARGE_FORM_CONFIG: DynamicFormConfig = {
  title: 'Create Discharge',
  submitLabel: 'Discharge Patient',
  cancelLabel: 'Cancel',
  showReset: true,

  fields: [
    {
      name: 'admissionId',
      label: 'Admission',
      type: 'select',
      placeholder: 'Select admission',
      required: true,
      options: [],
      validators: [Validators.required],
      col: 'col-12 col-md-6'
    },
    {
      name: 'doctorId',
      label: 'Doctor',
      type: 'select',
      placeholder: 'Select doctor',
      required: false,
      options: [],
      col: 'col-12 col-md-6'
    },
    {
      name: 'dischargeDate',
      label: 'Discharge Date',
      type: 'date',
      placeholder: 'Select discharge date',
      required: true,
      validators: [Validators.required],
      col: 'col-12 col-md-6'
    },
    {
      name: 'dischargeType',
      label: 'Discharge Type',
      type: 'select',
      placeholder: 'Select discharge type',
      required: true,
      options: [],
      validators: [Validators.required],
      col: 'col-12 col-md-6'
    },
    {
      name: 'dischargeSummary',
      label: 'Discharge Summary',
      type: 'textarea',
      placeholder: 'Enter discharge summary',
      required: false,
      col: 'col-12'
    }
  ]
};