  import { Validators } from '@angular/forms';
  import { DynamicFormConfig } from '../../../core/models/dynamic-form.model';
  import { DetailField } from '../../../shared/shared-details/shared-details.component';

  export const VISIT_FORM_CONFIG: DynamicFormConfig = {

    title: 'Visit',

    submitLabel: 'Save Visit',

    cancelLabel: 'Cancel',

    showReset: true,

    fields: [

      {
        name: 'patientId',
        label: 'Patient',
        type: 'select',
        placeholder: 'Select patient',
        required: true,
        options: [],
        validators: [
          Validators.required
        ],
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
    name: 'diagnosisId',
    label: 'Diagnosis',
    type: 'select',
    placeholder: 'Select diagnosis',
    required: false,
    options: [],
    col: 'col-12 col-md-6'
  },

      {
        name: 'departmentId',
        label: 'Department',
        type: 'select',
        placeholder: 'Select department',
        required: false,
        options: [],
        col: 'col-12 col-md-6'
      },

      {
        name: 'visitType',
        label: 'Visit Type',
        type: 'select',
        placeholder: 'Select visit type',
        required: true,
        options: [
          {
            label: 'OPD',
            value: 'OPD'
          },
          {
            label: 'IPD',
            value: 'IPD'
          }
        ],
        validators: [
          Validators.required
        ],
        col: 'col-12 col-md-6'
      },

      {
        name: 'visitDate',
        label: 'Visit Date',
        type: 'date',
        placeholder: 'Select visit date',
        required: false,
        col: 'col-12 col-md-6'
      },

      {
        name: 'reason',
        label: 'Reason',
        type: 'textarea',
        placeholder: 'Enter reason for visit',
        required: false,
        validators: [
          Validators.maxLength(5000)
        ],
        col: 'col-12'
      }

    ]
  };


  export const VISIT_DETAIL_FIELDS: DetailField[] = [

    {
      field: 'visitId',
      label: 'Visit ID'
    },

    {
      field: 'patientId',
      label: 'Patient ID'
    },

    {
      field: 'doctorName',
      label: 'Doctor'
    },

    {
      field: 'departmentName',
      label: 'Department'
    },

    {
      field: 'visitType',
      label: 'Visit Type'
    },

    {
      field: 'visitDate',
      label: 'Visit Date',
      type: 'date'
    },

    {
      field: 'reason',
      label: 'Reason'
    },

    {
      field: 'status',
      label: 'Status',
      type: 'status'
    }

  ];