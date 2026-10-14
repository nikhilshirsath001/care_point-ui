import { SharedTableConfig, TableColumn } from "../../../shared/shared-table/shared-table.component";

/* =========================================================
   STAFF DUTY SCHEDULE TABLE
   ========================================================= */

export const STAFF_SCHEDULE_COLUMNS: TableColumn[] = [

  {
    field: 'employeeNo',
    header: 'Employee No',
    sortable: true
  },

  {
    field: 'firstName',
    header: 'First Name',
    sortable: true
  },

  {
    field: 'lastName',
    header: 'Last Name',
    sortable: true
  },

  {
    field: 'department.departmentName',
    header: 'Department',
    sortable: true
  },

  {
    field: 'scheduleDate',
    header: 'Schedule Date',
    type: 'date',
    sortable: true
  },

  {
    field: 'shift',
    header: 'Shift',
    sortable: true
  },

  {
    field: 'startTime',
    header: 'Start Time',
    sortable: true
  },

  {
    field: 'endTime',
    header: 'End Time',
    sortable: true
  },

  {
    field: 'dutyLocation',
    header: 'Duty Location',
    sortable: true
  },

  {
    field: 'active',
    header: 'Status',
    type: 'status'
  },

  {
    field: 'actions',
    header: 'Actions',
    type: 'action',
    width: '150px'
  }

];


/* =========================================================
   MOCK STAFF DUTY SCHEDULE DATA
   ========================================================= */

export const STAFF_SCHEDULES = [

  {
    scheduleId: 1,

    staff: {
      staffId: 101,
      employeeNo: 'EMP-1001',
      firstName: 'Rahul',
      lastName: 'Sharma'
    },

    department: {
      departmentId: 1,
      departmentName: 'Cardiology'
    },

    scheduleDate: '2026-09-28',

    shift: 'MORNING',

    startTime: '08:00',

    endTime: '16:00',

    dutyLocation: 'Cardiology OPD',

    remarks: 'Regular OPD duty',

    active: true
  },

  {
    scheduleId: 2,

    staff: {
      staffId: 102,
      employeeNo: 'EMP-1002',
      firstName: 'Priya',
      lastName: 'Patil'
    },

    department: {
      departmentId: 2,
      departmentName: 'Emergency'
    },

    scheduleDate: '2026-09-28',

    shift: 'EVENING',

    startTime: '16:00',

    endTime: '00:00',

    dutyLocation: 'Emergency Department',

    remarks: 'Emergency duty',

    active: true
  },

  {
    scheduleId: 3,

    staff: {
      staffId: 103,
      employeeNo: 'EMP-1003',
      firstName: 'Amit',
      lastName: 'Deshmukh'
    },

    department: {
      departmentId: 3,
      departmentName: 'ICU'
    },

    scheduleDate: '2026-09-29',

    shift: 'NIGHT',

    startTime: '00:00',

    endTime: '08:00',

    dutyLocation: 'ICU',

    remarks: 'Night ICU duty',

    active: true
  }

];


/* =========================================================
   TABLE CONFIG
   ========================================================= */

export const STAFF_SCHEDULE_TABLE_CONFIG: SharedTableConfig = {

  searchable: true,

  paginator: true,

  rows: 10,

  rowsPerPageOptions: [10, 25, 50],

  exportable: true,

  showRefresh: true,

  loading: false,

  emptyMessage: 'No duty schedules found'

};