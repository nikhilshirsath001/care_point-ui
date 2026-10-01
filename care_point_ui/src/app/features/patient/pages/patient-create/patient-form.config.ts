import { Validators } from "@angular/forms";
import { DynamicFormConfig } from "../../../../core/models/dynamic-form.model";

export const PATIENT_FORM_CONFIG: DynamicFormConfig = {
  title: 'Patient Information',

  submitLabel: 'Patient',

  cancelLabel: 'Cancel',

  showReset: true,

  fields: [
    {
      name: 'abhaId',
      label: 'ABHA ID',
      type: 'text',
      placeholder: 'Enter ABHA ID',
      col: 'col-12 col-md-6',
    },


    {
      name: 'firstName',
      label: 'First Name',
      type: 'text',
      placeholder: 'Enter first name',
      required: true,
      col: 'col-12 col-md-6',
    },

    {
      name: 'lastName',
      label: 'Last Name',
      type: 'text',
      placeholder: 'Enter last name',
      col: 'col-12 col-md-6',
    },

    {
      name: 'dateOfBirth',
      label: 'Date of Birth',
      type: 'date',
      col: 'col-12 col-md-6',
    },

    {
      name: 'gender',
      label: 'Gender',
      type: 'select',
      placeholder: 'Select gender',
      options: [
        {
          label: 'Male',
          value: 'MALE',
        },
        {
          label: 'Female',
          value: 'FEMALE',
        },
        {
          label: 'Other',
          value: 'OTHER',
        },
      ],
      col: 'col-12 col-md-6',
    },

    {
      name: 'bloodGroup',
      label: 'Blood Group',
      type: 'select',
      placeholder: 'Select blood group',
      options: [
        { label: 'A+', value: 'A+' },
        { label: 'A-', value: 'A-' },
        { label: 'B+', value: 'B+' },
        { label: 'B-', value: 'B-' },
        { label: 'AB+', value: 'AB+' },
        { label: 'AB-', value: 'AB-' },
        { label: 'O+', value: 'O+' },
        { label: 'O-', value: 'O-' },
      ],
      col: 'col-12 col-md-6',
    },

    {
      name: 'phone',
      label: 'Phone',
      type: 'text',
      placeholder: 'Enter phone number',
      col: 'col-12 col-md-6',
    },

    {
      name: 'email',
      label: 'Email',
      type: 'email',
      placeholder: 'Enter email address',
      col: 'col-12 col-md-6',
    },

    {
      name: 'address',
      label: 'Address',
      type: 'textarea',
      placeholder: 'Enter address',
      col: 'col-12',
    },

    {
      name: 'city',
      label: 'City',
      type: 'text',
      placeholder: 'Enter city',
      col: 'col-12 md:col-4',
    },

    {
      name: 'state',
      label: 'State',
      type: 'text',
      placeholder: 'Enter state',
      col: 'col-12 md:col-4',
    },

    {
      name: 'pincode',
      label: 'Pincode',
      type: 'text',
      placeholder: 'Enter pincode',
      col: 'col-12 md:col-4',
    },

    {
      name: 'emergencyContactName',
      label: 'Emergency Contact Name',
      type: 'text',
      placeholder: 'Enter emergency contact name',
      col: 'col-12 col-md-6',
    },

    {
      name: 'emergencyContactPhone',
      label: 'Emergency Contact Phone',
      type: 'text',
      placeholder: 'Enter emergency contact phone',
      col: 'col-12 col-md-6',
    },

    {
      name: 'active',
      label: 'Active Patient',
      type: 'checkbox',
      defaultValue: true,
      col: 'col-12',
    },
  ],
};
