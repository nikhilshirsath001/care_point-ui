import { Validators } from '@angular/forms';
import { DynamicFormConfig } from '../../../core/models/dynamic-form.model';
import { DetailField } from '../../../shared/shared-details/shared-details.component';

export const PROCEDURE_FORM_CONFIG: DynamicFormConfig = {

  title: 'procedure',

  submitLabel: 'procedure',

  cancelLabel: 'Cancel',

  showReset: true,

  fields: [

    {
      name: 'procedureCode',
      label: 'procedure Code',
      type: 'text',
      placeholder: 'Enter procedure code',
      required: true,
      validators: [
        Validators.required,
        Validators.maxLength(20)
      ],
      col: 'col-12 col-md-6'
    },

    {
      name: 'procedureName',
      label: 'procedure Name',
      type: 'text',
      placeholder: 'Enter procedure name',
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
      placeholder: 'Enter procedure description',
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



export const PROCEDURE_DETAIL_FIELDS: DetailField[] = [

  {
    field: 'procedureCode',
    label: 'Procedure Code'
  },

  {
    field: 'procedureName',
    label: 'Procedure Name'
  },

  {
    field: 'description',
    label: 'Description'
  }

];