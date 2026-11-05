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
      required: false,
      eventType: 'blur',
      validators: [
        Validators.minLength(6),
        Validators.maxLength(15)
      ],
      eventMessage: '',
      eventMessageType: 'info',
      col: 'col-12 col-md-6',
    },

    {
      name: 'firstName',
      label: 'First Name',
      type: 'text',
      placeholder: 'Enter first name',
      required: true,
      validators: [
        Validators.required,
        Validators.maxLength(50)
      ],
      col: 'col-12 col-md-6',
    },

    {
      name: 'lastName',
      label: 'Last Name',
      type: 'text',
      placeholder: 'Enter last name',
      required: true,
      validators: [
        Validators.required,
        Validators.maxLength(50)
      ],
      col: 'col-12 col-md-6',
    },

    {
      name: 'dateOfBirth',
      label: 'Date of Birth',
      type: 'date',
      placeholder: 'Select date of birth',
      required: false,
      validators: [
        // Add Validators.required if DOB is mandatory
      ],
      col: 'col-12 col-md-6',
    },

    {
      name: 'gender',
      label: 'Gender',
      type: 'select',
      placeholder: 'Select gender',
      required: true,
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
      validators: [
        Validators.required
      ],
      col: 'col-12 col-md-6',
    },

    {
      name: 'bloodGroup',
      label: 'Blood Group',
      type: 'select',
      placeholder: 'Select blood group',
      required: false,
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
      validators: [],
      col: 'col-12 col-md-6',
    },

    {
      name: 'phone',
      label: 'Phone',
      type: 'text',
      placeholder: 'Enter phone number',
      required: true,
      validators: [
        Validators.required,
        Validators.pattern(/^[0-9]{10}$/)
      ],
      col: 'col-12 col-md-6',
    },

    {
      name: 'email',
      label: 'Email',
      type: 'email',
      placeholder: 'Enter email address',
      required: false,
      validators: [
        Validators.email,
        Validators.maxLength(100)
      ],
      col: 'col-12 col-md-6',
    },

    {
      name: 'address',
      label: 'Address',
      type: 'textarea',
      placeholder: 'Enter address',
      required: false,
      validators: [
        Validators.maxLength(250)
      ],
      col: 'col-12',
    },

    {
      name: 'city',
      label: 'City',
      type: 'text',
      placeholder: 'Enter city',
      required: false,
      validators: [
        Validators.maxLength(100)
      ],
      col: 'col-12 md:col-4',
    },

    {
      name: 'state',
      label: 'State',
      type: 'text',
      placeholder: 'Enter state',
      required: false,
      validators: [
        Validators.maxLength(100)
      ],
      col: 'col-12 md:col-4',
    },

    {
      name: 'pincode',
      label: 'Pincode',
      type: 'text',
      placeholder: 'Enter pincode',
      required: false,
      validators: [
        Validators.pattern(/^[0-9]{6}$/)
      ],
      col: 'col-12 md:col-4',
    },

    {
      name: 'emergencyContactName',
      label: 'Emergency Contact Name',
      type: 'text',
      placeholder: 'Enter emergency contact name',
      required: false,
      validators: [
        Validators.maxLength(100)
      ],
      col: 'col-12 col-md-6',
    },

    {
      name: 'emergencyContactPhone',
      label: 'Emergency Contact Phone',
      type: 'text',
      placeholder: 'Enter emergency contact phone',
      required: false,
      validators: [
        Validators.pattern(/^[0-9]{10}$/)
      ],
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
