import { Validators } from '@angular/forms';
import { DynamicFormConfig } from '../../../core/models/dynamic-form.model';

export const ROOM_FORM_CONFIG: DynamicFormConfig = {
  title: 'Room',
  submitLabel: 'Save Room',
  cancelLabel: 'Cancel',
  showReset: true,

  fields: [
    {
      name: 'wardId',
      label: 'Ward',
      type: 'select',
      placeholder: 'Select ward',
      required: true,
      validators: [Validators.required],
      options: [],
      col: 'col-12 col-md-6',
    },
    {
      name: 'roomNumber',
      label: 'Room Number',
      type: 'text',
      placeholder: 'e.g. 101',
      required: true,
      validators: [Validators.required, Validators.maxLength(30)],
      col: 'col-12 col-md-6',
    },
    {
      name: 'roomType',
      label: 'Room Type',
      type: 'select',
      placeholder: 'Select room type',
      required: true,
      validators: [Validators.required],
      options: [],
      col: 'col-12 col-md-6',
    },
    {
      name: 'status',
      label: 'Room Status',
      type: 'select',
      placeholder: 'Select status',
      required: true,
      validators: [Validators.required],
      options: [
        { label: 'Available', value: 'AVAILABLE' },
        { label: 'Occupied', value: 'OCCUPIED' },
        { label: 'Maintenance', value: 'MAINTENANCE' },
        { label: 'Unavailable', value: 'UNAVAILABLE' },
      ],
      col: 'col-12 col-md-6',
    },
  ],
};

export const ROOM_TYPES = [
  { value: "SINGLE", label: "Single" },
  { value: "TWIN_SHARING", label: "Twin Sharing" },
  { value: "GENERAL_WARD_ROOM", label: "General Ward Room" },
  { value: "SUITE", label: "Suite" },
  { value: "ISOLATION_ROOM", label: "Isolation Room" },
  { value: "TREATMENT_ROOM", label: "Treatment Room" }
];