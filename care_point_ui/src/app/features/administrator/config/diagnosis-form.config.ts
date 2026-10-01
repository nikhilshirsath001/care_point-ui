import { Validators } from '@angular/forms';
import { DynamicFormConfig } from '../../../core/models/dynamic-form.model';
import { DetailField } from '../../../shared/shared-details/shared-details.component';

export const DIAGNOSIS_FORM_CONFIG: DynamicFormConfig = {

  title: 'diagnosis',

  submitLabel: 'diagnosis',

  cancelLabel: 'Cancel',

  showReset: true,

  fields: [

    {
      name: 'diagnosisCode',
      label: 'diagnosis Code',
      type: 'text',
      placeholder: 'Enter diagnosis code',
      required: true,
      validators: [
        Validators.required,
        Validators.maxLength(20)
      ],
      col: 'col-12 col-md-6'
    },

    {
      name: 'diagnosisName',
      label: 'diagnosis Name',
      type: 'text',
      placeholder: 'Enter diagnosis name',
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
      placeholder: 'Enter diagnosis description',
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



export const DIAGNOSIS_DETAIL_FIELDS: DetailField[] = [

  {
    field: 'diagnosisCode',
    label: 'diagnosis Code'
  },

  {
    field: 'diagnosisName',
    label: 'diagnosis Name'
  },

  {
    field: 'description',
    label: 'Description'
  }

];