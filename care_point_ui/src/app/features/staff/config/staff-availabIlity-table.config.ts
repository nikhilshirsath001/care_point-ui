import { Validators } from '@angular/forms';
import { DynamicFormConfig } from '../../../core/models/dynamic-form.model';
import { DetailField } from '../../../shared/shared-details/shared-details.component';
import {
  SharedTableConfig,
  TableColumn
} from '../../../shared/shared-table/shared-table.component';


/* =========================================================
   STAFF AVAILABILITY FORM
   ========================================================= */

export const STAFF_AVAILABILITY_FORM_CONFIG: DynamicFormConfig = {

  title: 'Staff Availability',

  submitLabel: 'Save Availability',

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
      name: 'availabilityDate',
      label: 'Availability Date',
      type: 'date',
      placeholder: 'Select date',
      required: true,
      validators: [
        Validators.required
      ],
      col: 'col-12 col-md-6'
    },

    {
      name: 'status',
      label: 'Availability Status',
      type: 'select',
      placeholder: 'Select availability status',
      required: true,
      options: [
        {
          label: 'Available',
          value: 'AVAILABLE'
        },
        {
          label: 'Unavailable',
          value: 'UNAVAILABLE'
        },
        {
          label: 'On Leave',
          value: 'ON_LEAVE'
        },
        {
          label: 'On Duty',
          value: 'ON_DUTY'
        }
      ],
      validators: [
        Validators.required
      ],
      col: 'col-12 col-md-6'
    },

    {
      name: 'availableFrom',
      label: 'Available From',
      type: 'time',
      placeholder: 'Select start time',
      required: false,
      col: 'col-12 col-md-6'
    },

    {
      name: 'availableTo',
      label: 'Available To',
      type: 'time',
      placeholder: 'Select end time',
      required: false,
      col: 'col-12 col-md-6'
    },

    {
      name: 'remarks',
      label: 'Remarks',
      type: 'textarea',
      placeholder: 'Enter availability remarks',
      required: false,
      validators: [
        Validators.maxLength(500)
      ],
      col: 'col-12'
    }

  ]

};


/* =========================================================
   STAFF AVAILABILITY DETAILS
   ========================================================= */

export const STAFF_AVAILABILITY_DETAIL_FIELDS: DetailField[] = [

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
    field: 'staff.designation',
    label: 'Designation'
  },

  {
    field: 'department.departmentName',
    label: 'Department'
  },

  {
    field: 'availabilityDate',
    label: 'Availability Date',
    type: 'date'
  },

  {
    field: 'status',
    label: 'Availability Status',
    type: 'status'
  },

  {
    field: 'availableFrom',
    label: 'Available From'
  },

  {
    field: 'availableTo',
    label: 'Available To'
  },

  {
    field: 'remarks',
    label: 'Remarks'
  }

];


/* =========================================================
   STAFF AVAILABILITY TABLE
   ========================================================= */

export const STAFF_AVAILABILITY_COLUMNS: TableColumn[] = [

  {
    field: 'staff.employeeNo',
    header: 'Employee No',
    sortable: true
  },

  {
    field: 'staff.firstName',
    header: 'First Name',
    sortable: true
  },

  {
    field: 'staff.lastName',
    header: 'Last Name',
    sortable: true
  },

  {
    field: 'staff.designation',
    header: 'Designation',
    sortable: true
  },

  {
    field: 'department.departmentName',
    header: 'Department',
    sortable: true
  },

  {
    field: 'availabilityDate',
    header: 'Date',
    type: 'date',
    sortable: true
  },

  {
    field: 'status',
    header: 'Availability',
    type: 'status',
    sortable: true
  },

  {
    field: 'availableFrom',
    header: 'From'
  },

  {
    field: 'availableTo',
    header: 'To'
  },

  {
    field: 'actions',
    header: 'Actions',
    type: 'action',
    width: '150px'
  }

];


/* =========================================================
   MOCK STAFF AVAILABILITY DATA
   ========================================================= */

export const STAFF_AVAILABILITIES = [

  {
    availabilityId: 1,

    staff: {
      staffId: 101,
      employeeNo: 'EMP-1001',
      firstName: 'Rahul',
      lastName: 'Sharma',
      designation: 'Consultant Cardiologist'
    },

    department: {
      departmentId: 1,
      departmentName: 'Cardiology'
    },

    availabilityDate: '2026-09-28',

    status: 'AVAILABLE',

    availableFrom: '08:00',

    availableTo: '16:00',

    remarks: 'Available for OPD and consultation'
  },

  {
    availabilityId: 2,

    staff: {
      staffId: 102,
      employeeNo: 'EMP-1002',
      firstName: 'Priya',
      lastName: 'Patil',
      designation: 'Staff Nurse'
    },

    department: {
      departmentId: 2,
      departmentName: 'Emergency'
    },

    availabilityDate: '2026-09-28',

    status: 'ON_DUTY',

    availableFrom: '16:00',

    availableTo: '00:00',

    remarks: 'Assigned to emergency department'
  },

  {
    availabilityId: 3,

    staff: {
      staffId: 103,
      employeeNo: 'EMP-1003',
      firstName: 'Amit',
      lastName: 'Deshmukh',
      designation: 'ICU Nurse'
    },

    department: {
      departmentId: 3,
      departmentName: 'ICU'
    },

    availabilityDate: '2026-09-28',

    status: 'ON_LEAVE',

    availableFrom: null,

    availableTo: null,

    remarks: 'Annual leave'
  },

  {
    availabilityId: 4,

    staff: {
      staffId: 104,
      employeeNo: 'EMP-1004',
      firstName: 'Sneha',
      lastName: 'Joshi',
      designation: 'Resident Doctor'
    },

    department: {
      departmentId: 4,
      departmentName: 'General Medicine'
    },

    availabilityDate: '2026-09-28',

    status: 'UNAVAILABLE',

    availableFrom: null,

    availableTo: null,

    remarks: 'Not available today'
  }

];


/* =========================================================
   TABLE CONFIG
   ========================================================= */

export const STAFF_AVAILABILITY_TABLE_CONFIG: SharedTableConfig = {

  searchable: true,

  paginator: true,

  rows: 10,

  rowsPerPageOptions: [10, 25, 50],

  exportable: true,

  showRefresh: true,

  loading: false,

  emptyMessage: 'No staff availability records found'

};