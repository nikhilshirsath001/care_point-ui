import { Validators } from '@angular/forms';
import { DynamicFormConfig } from '../../../core/models/dynamic-form.model';

export const DEPARTMENT_FORM_CONFIG: DynamicFormConfig = {

  title: 'Department',

  submitLabel: 'Save Department',

  cancelLabel: 'Cancel',

  showReset: true,

  fields: [

    {
      name: 'departmentCode',
      label: 'Department Code',
      type: 'text',
      placeholder: 'Enter department code',
      required: true,
      validators: [
        Validators.required,
        Validators.maxLength(20)
      ],
      col: 'col-12 col-md-6'
    },

    {
      name: 'departmentName',
      label: 'Department Name',
      type: 'text',
      placeholder: 'Enter department name',
      required: true,
      validators: [
        Validators.required,
        Validators.maxLength(100)
      ],
      col: 'col-12 col-md-6'
    },

    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
      placeholder: 'Enter department description',
      required: false,
      validators: [
        Validators.maxLength(255)
      ],
      col: 'col-12'
    },

    {
      name: 'active',
      label: 'Active',
      type: 'checkbox',
      defaultValue: true,
      col: 'col-12'
    }

  ]
};