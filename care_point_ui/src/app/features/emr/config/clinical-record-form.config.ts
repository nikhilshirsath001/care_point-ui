import { Validators } from '@angular/forms';
import { DynamicFormConfig } from '../../../core/models/dynamic-form.model';


export const CLINICAL_RECORD_FORM_CONFIG: DynamicFormConfig = {

  title: 'Medical Record',

  submitLabel: 'Save Medical Record',

  cancelLabel: 'Cancel',

  showReset: true,

  fields: [

  
    {
      name: 'recordDate',
      label: 'Record Date',
      type: 'date',
      col: '6'
    },

    {
      name: 'symptoms',
      label: 'Symptoms',
      type: 'textarea',
      placeholder: 'Enter patient symptoms',
      col: '12'
    },

    {
      name: 'treatment',
      label: 'Treatment',
      type: 'textarea',
      placeholder: 'Enter treatment details',
      col: '12'
    },

    {
      name: 'notes',
      label: 'Notes',
      type: 'textarea',
      placeholder: 'Enter additional clinical notes',
      col: '12'
    }

  ]
};