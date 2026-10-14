import { Validators } from '@angular/forms';
import { DynamicFormConfig } from '../../../core/models/dynamic-form.model';
import { DetailField } from '../../../shared/shared-details/shared-details.component';

export const SERVICE_FORM_CONFIG: DynamicFormConfig = {

  title: 'Service',

  submitLabel: 'Save Service',

  cancelLabel: 'Cancel',

  showReset: true,

  fields: [

    // =========================
    // SERVICE CODE
    // =========================
    {
      name: 'serviceCode',
      label: 'Service Code',
      type: 'text',
      placeholder: 'Enter service code',
      required: true,
      validators: [
        Validators.required,
        Validators.maxLength(20)
      ],
      col: 'col-12 col-md-6'
    },

    // =========================
    // SERVICE NAME
    // =========================
    {
      name: 'serviceName',
      label: 'Service Name',
      type: 'text',
      placeholder: 'Enter service name',
      required: true,
      validators: [
        Validators.required,
        Validators.maxLength(100)
      ],
      col: 'col-12 col-md-6'
    },

    // =========================
    // SERVICE CATEGORY
    // =========================
    {
      name: 'serviceCategoryId',
      label: 'Service Category',
      type: 'select',
      placeholder: 'Select service category',
      required: true,
      validators: [
        Validators.required
      ],
      col: 'col-12 col-md-6'
    },

    // =========================
    // DEFAULT PRICE
    // =========================
    {
      name: 'defaultPrice',
      label: 'Default Price',
      type: 'number',
      placeholder: 'Enter default price',
      required: true,
      validators: [
        Validators.required,
        Validators.min(0)
      ],
      col: 'col-12 col-md-6'
    }

  ]
};


export const SERVICE_DETAIL_FIELDS: DetailField[] = [

  {
    field: 'serviceCode',
    label: 'Service Code'
  },

  {
    field: 'serviceName',
    label: 'Service Name'
  },

  {
    field: 'serviceCategoryId',
    label: 'Service Category'
  },

  {
    field: 'defaultPrice',
    label: 'Default Price'
  }

];