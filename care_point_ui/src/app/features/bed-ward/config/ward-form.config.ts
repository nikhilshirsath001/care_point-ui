import { Validators } from '@angular/forms';
import { DynamicFormConfig } from '../../../core/models/dynamic-form.model';

export const WARD_FORM_CONFIG: DynamicFormConfig = {
  title: 'Ward',
  submitLabel: 'Save Ward',
  cancelLabel: 'Cancel',
  showReset: true,

  fields: [
    {
      name: 'wardName',
      label: 'Ward Name',
      type: 'text',
      placeholder: 'Enter ward name',
      required: true,
      validators: [Validators.required, Validators.maxLength(100)],
      col: 'col-12 col-md-6',
    },
    {
      name: 'departmentId',
      label: 'Department',
      type: 'select',
      placeholder: 'Select Department',
      required: true,
      validators: [Validators.required],
      options: [],
      col: 'col-12 col-md-6',
    },
    {
      name: 'floorId',
      label: 'Floor',
      type: 'select',
      placeholder: 'Select floor',
      required: true,
      validators: [Validators.required],
      options: [],
      col: 'col-12 col-md-6',
    },
    {
      name: 'wardType',
      label: 'Ward Type',
      type: 'select',
      placeholder: 'Select ward type',
      required: true,
      validators: [Validators.required],
      options: [],
      col: 'col-12 col-md-6',
    },
    {
      name: 'active',
      label: 'Active',
      type: 'checkbox',
      defaultValue: true,
      col: 'col-12',
    },
  ],
};

export const WARD_TYPES = [
  { value: "GENERAL", label: "General" },
  { value: "ICU", label: "ICU" },
  { value: "NICU", label: "NICU" },
  { value: "HDU", label: "HDU" },
  { value: "MATERNITY", label: "Maternity" },
  { value: "PEDIATRIC", label: "Pediatric" },
  { value: "ISOLATION", label: "Isolation" },
  { value: "PRIVATE", label: "Private" },
  { value: "SEMI_PRIVATE", label: "Semi-Private" }
];