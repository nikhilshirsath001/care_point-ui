import { Validators } from '@angular/forms';

import {
  DynamicFormConfig
} from '../../../core/models/dynamic-form.model';

import {
  DetailField
} from '../../../shared/shared-details/shared-details.component';


export const MEDICATION_FORM_CONFIG: DynamicFormConfig = {

  title: 'Medication',

  submitLabel: 'Save Medication',

  cancelLabel: 'Cancel',

  showReset: true,

  fields: [

    {
      name: 'name',

      label: 'Medication Name',

      type: 'text',

      placeholder: 'Enter medication name',

      required: true,

      validators: [
        Validators.required
      ],

      col: 'col-12 col-md-6'
    },

    {
      name: 'genericName',

      label: 'Generic Name',

      type: 'text',

      placeholder: 'Enter generic name',

      required: true,

      validators: [
        Validators.required
      ],

      col: 'col-12 col-md-6'
    },

    {
      name: 'strength',

      label: 'Strength',

      type: 'text',

      placeholder: 'e.g. 500 mg',

      required: true,

      validators: [
        Validators.required
      ],

      col: 'col-12 col-md-6'
    },

    {
      name: 'active',

      label: 'Active',

      type: 'checkbox',

      required: false,

      defaultValue: true,

      col: 'col-12'
    }

  ]
};


export const MEDICATION_DETAILS_FIELD: DetailField[] = [

  {
    field: 'name',
    label: 'Medication Name'
  },

  {
    field: 'genericName',
    label: 'Generic Name'
  },

  {
    field: 'strength',
    label: 'Strength'
  },

  {
    field: 'active',
    label: 'Active',
    type: 'status'
  }

];
