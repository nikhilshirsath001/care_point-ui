import { Component } from '@angular/core';
import { DashboardComponent } from '../../../../shared/dashboard/dashboard.component';

@Component({
  selector: 'app-main-dashboard',
  imports: [DashboardComponent],
  templateUrl: './main-dashboard.component.html',
  styleUrl: './main-dashboard.component.css'
})
export class MainDashboardComponent {

  patientLabels = [
  'OPD Patients',
  'IPD Patients',
  'Emergency',
  'Follow-up'
];

patientData = [
  450,
  180,
  75,
  120
];

patientColors = [
  '#3B82F6',
  '#10B981',
  '#F59E0B',
  '#EF4444'
];


appointmentLabels = [
  'Completed',
  'Scheduled',
  'Cancelled',
  'Pending'
];

appointmentData = [
  120,
  80,
  25,
  35
];

appointmentColors = [
  '#10B981',
  '#3B82F6',
  '#EF4444',
  '#F59E0B'
];
}
