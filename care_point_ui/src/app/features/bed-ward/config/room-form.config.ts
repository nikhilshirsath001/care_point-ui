import { Validators } from '@angular/forms';
import { DynamicFormConfig } from '../../../core/models/dynamic-form.model';

export const ROOM_FORM_CONFIG: DynamicFormConfig = {

  title: 'ward',

  submitLabel: 'Save Bed',

  cancelLabel: 'Cancel',

  showReset: true,

  fields: [

    {
      name: 'bedNumber',
      label: 'Bed Number',
      type: 'text',
      placeholder: 'Enter bed number',
      required: true,
      validators: [
        Validators.required,
        Validators.maxLength(50)
      ],
      col: 'col-12 col-md-6'
    },

    {
      name: 'bedType',
      label: 'Bed Type',
      type: 'select',
      placeholder: 'Select bed type',
      required: true,
      options: [
        {
          label: 'General',
          value: 'GENERAL'
        },
        {
          label: 'ICU',
          value: 'ICU'
        },
        {
          label: 'Private',
          value: 'PRIVATE'
        },
        {
          label: 'Semi Private',
          value: 'SEMI_PRIVATE'
        }
      ],
      validators: [
        Validators.required
      ],
      col: 'col-12 col-md-6'
    },

    // {
    //   name: 'wardId',
    //   label: 'Ward',
    //   type: 'select',
    //   placeholder: 'Select ward',
    //   required: true,
    //   options: [],
    //   validators: [
    //     Validators.required
    //   ],
    //   col: 'col-12 col-md-6'
    // },

    // {
    //   name: 'roomId',
    //   label: 'Room',
    //   type: 'select',
    //   placeholder: 'Select room',
    //   required: true,
    //   options: [],
    //   validators: [
    //     Validators.required
    //   ],
    //   col: 'col-12 col-md-6'
    // },

    {
      name: 'floor',
      label: 'Floor',
      type: 'number',
      placeholder: 'Enter floor number',
      required: true,
      validators: [
        Validators.required
      ],
      col: 'col-12 col-md-6'
    },

    {
      name: 'status',
      label: 'Status',
      type: 'select',
      placeholder: 'Select status',
      required: true,
      defaultValue: 'AVAILABLE',
      options: [
        {
          label: 'Available',
          value: 'AVAILABLE'
        },
        {
          label: 'Occupied',
          value: 'OCCUPIED'
        },
        {
          label: 'Reserved',
          value: 'RESERVED'
        },
        {
          label: 'Maintenance',
          value: 'MAINTENANCE'
        },
        {
          label: 'Blocked',
          value: 'BLOCKED'
        }
      ],
      validators: [
        Validators.required
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