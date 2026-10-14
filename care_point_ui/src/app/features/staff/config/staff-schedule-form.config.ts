import { Validators } from '@angular/forms';
import { DynamicFormConfig } from '../../../core/models/dynamic-form.model';
import { DetailField } from '../../../shared/shared-details/shared-details.component';
import {
  SharedTableConfig,
  TableColumn
} from '../../../shared/shared-table/shared-table.component';


/* =========================================================
   STAFF DUTY SCHEDULE FORM
   ========================================================= */

export const STAFF_SCHEDULE_FORM_CONFIG: DynamicFormConfig = {

  title: 'Staff Duty Schedule',

  submitLabel: 'Save Schedule',

  cancelLabel: 'Cancel',

  showReset: true,

  fields: [

    {
      name: 'staffId',
      label: 'Staff',
      type: 'select',
      placeholder: 'Select staff member',
      required: true,
      options: [],
      validators: [
        Validators.required
      ],
      col: 'col-12 col-md-6'
    },

    {
      name: 'departmentId',
      label: 'Department',
      type: 'select',
      placeholder: 'Select department',
      required: true,
      options: [],
      validators: [
        Validators.required
      ],
      col: 'col-12 col-md-6'
    },

    {
      name: 'scheduleDate',
      label: 'Schedule Date',
      type: 'date',
      placeholder: 'Select schedule date',
      required: true,
      validators: [
        Validators.required
      ],
      col: 'col-12 col-md-6'
    },

    {
      name: 'shift',
      label: 'Shift',
      type: 'select',
      placeholder: 'Select shift',
      required: true,
      options: [
        {
          label: 'Morning',
          value: 'MORNING'
        },
        {
          label: 'Afternoon',
          value: 'AFTERNOON'
        },
        {
          label: 'Evening',
          value: 'EVENING'
        },
        {
          label: 'Night',
          value: 'NIGHT'
        }
      ],
      validators: [
        Validators.required
      ],
      col: 'col-12 col-md-6'
    },

    {
      name: 'startTime',
      label: 'Start Time',
      type: 'time',
      placeholder: 'Select start time',
      required: true,
      validators: [
        Validators.required
      ],
      col: 'col-12 col-md-6'
    },

    {
      name: 'endTime',
      label: 'End Time',
      type: 'time',
      placeholder: 'Select end time',
      required: true,
      validators: [
        Validators.required
      ],
      col: 'col-12 col-md-6'
    },

    {
      name: 'dutyLocation',
      label: 'Duty Location',
      type: 'text',
      placeholder: 'e.g. OPD, ICU, Emergency',
      required: false,
      validators: [
        Validators.maxLength(100)
      ],
      col: 'col-12 col-md-6'
    },

    {
      name: 'remarks',
      label: 'Remarks',
      type: 'textarea',
      placeholder: 'Enter any remarks',
      required: false,
      validators: [
        Validators.maxLength(500)
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


/* =========================================================
   STAFF DUTY SCHEDULE DETAILS
   ========================================================= */

export const STAFF_SCHEDULE_DETAIL_FIELDS: DetailField[] = [

  {
    field: 'staff.employeeNo',
    label: 'Employee No'
  },

  {
    field: 'staff.firstName',
    label: 'First Name'
  },

  {
    field: 'staff.lastName',
    label: 'Last Name'
  },

  {
    field: 'department.departmentName',
    label: 'Department'
  },

  {
    field: 'scheduleDate',
    label: 'Schedule Date',
    type: 'date'
  },

  {
    field: 'shift',
    label: 'Shift'
  },

  {
    field: 'startTime',
    label: 'Start Time'
  },

  {
    field: 'endTime',
    label: 'End Time'
  },

  {
    field: 'dutyLocation',
    label: 'Duty Location'
  },

  {
    field: 'remarks',
    label: 'Remarks'
  },

  {
    field: 'active',
    label: 'Status',
    type: 'status'
  }

];

