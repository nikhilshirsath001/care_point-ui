import { Validators } from '@angular/forms';
import { DynamicFormConfig } from '../../../core/models/dynamic-form.model';
import { DetailField } from '../../../shared/shared-details/shared-details.component';

export const USER_FORM_CONFIG: DynamicFormConfig = {
  title: 'User',
  submitLabel: 'Save User',
  cancelLabel: 'Cancel',
  showReset: true,

  fields: [
    {
      name: 'staffId',
      label: 'Staff',
      type: 'number',
      placeholder: 'Enter staff ID',
      required: true,
      validators: [
        Validators.required,
        Validators.min(1)
      ],
      col: 'col-12 col-md-6'
    },

    {
      name: 'employeeNo',
      label: 'Employee No',
      type: 'text',
      placeholder: 'Enter employee number',
      required: true,
      validators: [
        Validators.required
      ],
      col: 'col-12 col-md-6'
    },

    {
      name: 'firstName',
      label: 'First Name',
      type: 'text',
      placeholder: 'Enter first name',
      required: true,
      validators: [
        Validators.required,
        Validators.minLength(2)
      ],
      col: 'col-12 col-md-6'
    },

    {
      name: 'lastName',
      label: 'Last Name',
      type: 'text',
      placeholder: 'Enter last name',
      required: true,
      validators: [
        Validators.required,
        Validators.minLength(2)
      ],
      col: 'col-12 col-md-6'
    },

    {
      name: 'username',
      label: 'Username',
      type: 'text',
      placeholder: 'Enter username',
      required: true,
      validators: [
        Validators.required,
        Validators.minLength(3)
      ],
      col: 'col-12 col-md-6'
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

export const USER_DETAILS_FIELD: DetailField[] = [
  {
    field: 'userId',
    label: 'User ID'
  },
  {
    field: 'staffId',
    label: 'Staff ID'
  },
  {
    field: 'employeeNo',
    label: 'Employee No'
  },
  {
    field: 'firstName',
    label: 'First Name'
  },
  {
    field: 'lastName',
    label: 'Last Name'
  },
  {
    field: 'username',
    label: 'Username'
  },
  {
    field: 'active',
    label: 'Status',
    type: 'status'
  },
  {
    field: 'createdAt',
    label: 'Created At',
    type: 'date'
  },
  {
    field: 'updatedAt',
    label: 'Updated At',
    type: 'date'
  }
];

