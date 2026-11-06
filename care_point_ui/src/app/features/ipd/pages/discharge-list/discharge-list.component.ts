import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';

import {
  SharedTableComponent,
  TableColumn,
  SharedTableConfig
} from '../../../../shared/shared-table/shared-table.component';

import { DischargeService } from '../../../discharge/discharge.service';
import { IpdService } from '../../services/ipd.service';
import { StaffService } from '../../../staff/services/staff.service';

@Component({
  selector: 'app-discharge-list',
  standalone: true,
  imports: [
    CommonModule,
    SharedTableComponent
  ],
  templateUrl: './discharge-list.component.html',
  styleUrl: './discharge-list.component.css'
})
export class DischargeListComponent implements OnInit {

  dischargeList: any[] = [];

  dischargeColumns: TableColumn[] = [
    { field: 'dischargeId', header: 'Discharge ID', sortable: true },
    { field: 'patientName', header: 'Patient Name', sortable: true },
    { field: 'doctorName', header: 'Doctor Name', sortable: true },
    { field: 'dischargeDate', header: 'Discharge Date', type: 'date', sortable: true },
    { field: 'dischargeType', header: 'Discharge Type', type: 'status' },
    { field: 'dischargeSummary', header: 'Discharge Summary' }
  ];

  dischargeTableConfig: SharedTableConfig = {
    searchable: true,
    paginator: true,
    rows: 10,
    rowsPerPageOptions: [5, 10, 20],
    exportable: true,
    showRefresh: true,
    loading: false,
    emptyMessage: 'No discharged patients found'
  };

  constructor(
    private ipdService: IpdService,
    private staffService: StaffService,
    private dischargeService: DischargeService
  ) {}

  ngOnInit(): void {
    this.getAllDischarges();
  }

  getAllDischarges(): void {
    this.dischargeTableConfig = {
      ...this.dischargeTableConfig,
      loading: true
    };

    forkJoin({
      discharges: this.dischargeService.getAllDischarges(),
      admissions: this.ipdService.getAllInPatients(),
      staff: this.staffService.getAllStaff()
    }).subscribe({
      next: (res: any) => {
        const discharges = res.discharges?.data ?? [];
        const admissions = res.admissions?.data ?? [];
        const staff = res.staff?.data?.content ?? [];

        this.dischargeList = discharges.map((discharge: any) => {
          const admission = admissions.find(
            (item: any) =>
              Number(item.admissionId) === Number(discharge.admissionId)
          );

          const doctor = staff.find(
            (item: any) =>
              Number(item.staffId) === Number(discharge.doctorId)
          );

          const patientName =
            admission?.patientName ??
            admission?.patient?.patientName ??
            (
              admission?.patient?.firstName
                ? `${admission.patient.firstName} ${admission.patient.lastName ?? ''}`.trim()
                : 'N/A'
            );

          const doctorName = doctor
            ? `${doctor.firstName ?? ''} ${doctor.lastName ?? ''}`.trim()
            : 'N/A';

          return {
            ...discharge,
            patientName,
            doctorName: doctorName || 'N/A'
          };
        });
      },
      error: (error: any) => {
        console.error('Failed to load discharge records', error);
      },
      complete: () => {
        this.dischargeTableConfig = {
          ...this.dischargeTableConfig,
          loading: false
        };
      }
    });
  }
}