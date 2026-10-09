import { Validators } from '@angular/forms';
import { DynamicFormConfig } from '../../../core/models/dynamic-form.model';

export const FLOOR_FORM_CONFIG: DynamicFormConfig = {
  title: 'Floor',
  submitLabel: 'Save Floor',
  cancelLabel: 'Cancel',
  showReset: true,

  fields: [
    {
      name: 'floorNumber',
      label: 'Floor Number',
      type: 'number',
      placeholder: 'Enter floor number',
      required: true,
      validators: [Validators.required, Validators.min(0)],
      col: 'col-12 col-md-6',
    },
    {
      name: 'floorName',
      label: 'Floor Name',
      type: 'text',
      placeholder: 'e.g. Ground Floor',
      required: true,
      validators: [Validators.required, Validators.maxLength(100)],
      col: 'col-12 col-md-6',
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
      placeholder: 'Enter floor description',
      col: 'col-12',
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