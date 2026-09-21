import { Component } from '@angular/core';
import { SharedTableComponent, SharedTableConfig, TableColumn } from '../../../../shared/shared-table/shared-table.component';

@Component({
  selector: 'app-patient-list',
  imports: [SharedTableComponent],
  templateUrl: './patient-list.component.html',
  styleUrl: './patient-list.component.css'
})
export class PatientListComponent {

  
   patientColumns: TableColumn[] = [
    {
      field: 'patientId',
      header: 'Patient ID',
      sortable: true
    },
    {
      field: 'name',
      header: 'Patient Name',
      sortable: true
    },
    {
      field: 'mobile',
      header: 'Mobile',
      sortable: true
    },
    {
      field: 'gender',
      header: 'Gender'
    },
    {
      field: 'status',
      header: 'Status',
      type: 'status'
    }
  ];

  patients = [
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

  tableConfig: SharedTableConfig = {
  searchable: true,
  paginator: true,
  rows: 10,
  rowsPerPageOptions: [10, 25, 50],
  exportable: true,
  showRefresh: true,
  loading: false,
  emptyMessage: 'No patients found'
};
}
