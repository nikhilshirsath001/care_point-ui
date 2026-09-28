import { SharedTableConfig, TableColumn } from "../../../shared/shared-table/shared-table.component";

export const STAFF_COLUMNS: TableColumn[] = [

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
    field: 'phone',
    header: 'Phone',
    sortable: true
  },

  {
    field: 'designation',
    header: 'Designation',
    sortable: true
  },

  {
    field: 'specialization',
    header: 'Specialization',
    sortable: true
  },

  {
    field: 'department.departmentName',
    header: 'Department',
    sortable: true
  },

  {
    field: 'joiningDate',
    header: 'Joining Date',
    type: 'date',
    sortable: true
  },

//   {
//     field: 'active',
//     header: 'Status',
//     type: 'stsatus'
//   },

  {
    field: 'actions',
    header: 'Actions',
    type: 'action',
    width: '150px'
  }

];
  
export const STAFFS = [
      {
        patientId: 'P1001',
        name: 'Rahul Sharma',
        mobile: '9876543210',
        gender: 'Male',
        status: 'Active'
      },
      {
        patientId: 'P1002',
        name: 'Priya Patil',
        mobile: '9876501234',
        gender: 'Female',
        status: 'Active'
      }
    ];
  
export  let  TABLE_CONFIG: SharedTableConfig = {
    searchable: true,
    paginator: true,
    rows: 10,
    rowsPerPageOptions: [10, 25, 50],
    exportable: true,
    showRefresh: true,
    loading: false,
    emptyMessage: 'No patients found'
  };