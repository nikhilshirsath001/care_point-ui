import { Validators } from '@angular/forms';
import { DynamicFormConfig } from '../../../core/models/dynamic-form.model';
import { DetailField } from '../../../shared/shared-details/shared-details.component';

export const STAFF_FORM_CONFIG: DynamicFormConfig = {
  title: 'Staff',

  submitLabel: 'Save Staff',

  cancelLabel: 'Cancel',

  showReset: true,

  fields: [
    {
      name: 'employeeNo',
      label: 'Employee No',
      type: 'text',
      placeholder: 'Enter employee number',
      required: true,
      validators: [Validators.required, Validators.maxLength(30)],
      col: 'col-12 col-md-6',
    },

    {
      name: 'firstName',
      label: 'First Name',
      type: 'text',
      placeholder: 'Enter first name',
      required: true,
      validators: [Validators.required, Validators.maxLength(50)],
      col: 'col-12 col-md-6',
    },

    {
      name: 'lastName',
      label: 'Last Name',
      type: 'text',
      placeholder: 'Enter last name',
      required: true,
      validators: [Validators.required, Validators.maxLength(50)],
      col: 'col-12 col-md-6',
    },

    {
      name: 'phone',
      label: 'Phone',
      type: 'text',
      placeholder: 'Enter phone number',
      required: true,
      validators: [Validators.required, Validators.maxLength(20)],
      col: 'col-12 col-md-6',
    },

    {
      name: 'email',
      label: 'Email',
      type: 'email',
      placeholder: 'Enter email address',
      required: true,
      validators: [
        Validators.required,
        Validators.email,
        Validators.maxLength(100),
      ],
      col: 'col-12 col-md-6',
    },

    {
      name: 'designation',
      label: 'Designation',
      type: 'text',
      placeholder: 'Enter designation',
      required: true,
      validators: [Validators.required, Validators.maxLength(100)],
      col: 'col-12 col-md-6',
    },

    {
      name: 'specialization',
      label: 'Specialization',
      type: 'text',
      placeholder: 'Enter specialization',
      required: false,
      validators: [Validators.maxLength(100)],
      col: 'col-12 col-md-6',
    },

    {
      name: 'departmentId',
      label: 'Department',
      type: 'select',
      placeholder: 'Select department',
      required: true,
      options: [],
      validators: [Validators.required],
      col: 'col-12 col-md-6',
    },
    {
      name: 'roleId',
      label: 'Role',
      type: 'select',
      placeholder: 'Select Role',
      required: true,
      options: [],
      validators: [Validators.required],
      col: 'col-12 col-md-6',
    },

    {
      name: 'joiningDate',
      label: 'Joining Date',
      type: 'date',
      placeholder: 'Select joining date',
      required: true,
      validators: [Validators.required],
      col: 'col-12 col-md-6',
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

export const STAFF_DETAIL_FIELDS: DetailField[] = [
  {
    field: 'employeeNo',
    label: 'Employee No',
  },

  {
    field: 'firstName',
    label: 'First Name',
  },

  {
    field: 'lastName',
    label: 'Last Name',
  },

  {
    field: 'phone',
    label: 'Phone',
  },

  {
    field: 'email',
    label: 'Email',
  },

  {
    field: 'designation',
    label: 'Designation',
  },

  {
    field: 'specialization',
    label: 'Specialization',
  },

  {
    field: 'department.departmentName',
    label: 'Department',
  },

  {
    field: 'joiningDate',
    label: 'Joining Date',
    type: 'date',
  },

  {
    field: 'active',
    label: 'Status',
    type: 'status',
  },
];
