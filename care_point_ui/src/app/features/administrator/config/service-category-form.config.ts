import { Validators } from '@angular/forms';
import { DynamicFormConfig } from '../../../core/models/dynamic-form.model';
import { DetailField } from '../../../shared/shared-details/shared-details.component';

export const SERVICE_CATEGORY_FORM_CONFIG: DynamicFormConfig = {

  title: 'Service Category',

  submitLabel: 'Service Category',

  cancelLabel: 'Cancel',

  showReset: true,

  fields: [



    {
      name: 'categoryName',
      label: 'Category Name',
      type: 'text',
      placeholder: 'Enter Category name',
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
      placeholder: 'Enter Service Category description',
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



export const SERVICE_CATEGORY_DETAIL_FIELDS: DetailField[] = [

  {
    field: 'categoryName',
    label: 'Service Category Name'
  },

  {
    field: 'description',
    label: 'Description'
  }

];