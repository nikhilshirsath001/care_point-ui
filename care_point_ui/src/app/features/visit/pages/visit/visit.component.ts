  import { Component, OnInit } from '@angular/core';
  import { CommonModule } from '@angular/common';
  import { FormsModule } from '@angular/forms';
  import { ButtonModule } from 'primeng/button';
  import { InputTextModule } from 'primeng/inputtext';
  import { DialogModule } from 'primeng/dialog';
  import { VisitService } from '../../services/visit.service';
  import { Visit } from '../../models/visit.model';
  import {
    SharedTableComponent,
    TableColumn
  } from '../../../../shared/shared-table/shared-table.component';
  import {
    SharedDetailsComponent,
    DetailField
  } from '../../../../shared/shared-details/shared-details.component';
  import { VisitFormComponent } from '../../components/visit-form/visit-form.component';
  import { PatientService } from '../../../patient/services/patient-service.service';

  @Component({
    selector: 'app-visit',
    standalone: true,
    imports: [
      CommonModule,
      SharedTableComponent,
      FormsModule,
      DialogModule,
      ButtonModule,
      InputTextModule,
      VisitFormComponent,
      SharedDetailsComponent
    ],
    templateUrl: './visit.component.html',
    styleUrl: './visit.component.css'
  })
  export class VisitComponent implements OnInit {

    visits: Visit[] = [];
    filteredVisits: Visit[] = [];

    patients: any[] = [];

    selectedVisit: Visit | null = null;

    showForm = false;
    showDetails = false;

    formMode: 'create' | 'edit' = 'create';

    loading = false;

    visitColumns: TableColumn[] = [
      {
        field: 'visitId',
        header: 'Visit ID'
      },
      {
        field: 'patientName',
        header: 'Patient Name'
      },
      {
        field: 'doctorName',
        header: 'Doctor'
      },
      {
        field: 'visitType',
        header: 'Visit Type'
      },
      {
        field: 'visitDate',
        header: 'Visit Date'
      },
      {
        field: 'status',
        header: 'Status'
      },
      {
        field: 'actions',
        header: 'Actions',
        type: 'action'
      }
    ];

    tableConfig: any = {
      searchable: true,
      paginator: true,
      rows: 10,
      rowsPerPageOptions: [10, 20, 50],
      exportable: true,
      showRefresh: true,
      loading: false,
      emptyMessage: 'No visits found'
    };

    visitDetailFields: DetailField[] = [
      {
        field: 'visitId',
        label: 'Visit ID'
      },
      {
        field: 'patientId',
        label: 'Patient ID'
      },
      {
        field: 'doctorName',
        label: 'Doctor'
      },
      {
        field: 'departmentName',
        label: 'Department'
      },
      {
        field: 'visitType',
        label: 'Visit Type'
      },
      {
        field: 'visitDate',
        label: 'Visit Date',
        type: 'date'
      },
      {
        field: 'reason',
        label: 'Reason'
      },
      {
        field: 'status',
        label: 'Status',
        type: 'status'
      } 
  ,
      {
      field: 'diagnosisName',
      label: 'Diagnosis'
      },
    ];

    constructor(
      private visitService: VisitService,
      private patientService: PatientService
    ) {}

    ngOnInit(): void {
      this.loadVisits();
    }


    loadVisits(): void {
      this.loading = true;

      this.patientService.getAllPatients(0, 100).subscribe({
        next: (patientResponse: any) => {

          const patients =
            patientResponse?.data?.content ??
            patientResponse?.data ??
            patientResponse ??
            [];

          this.patients = Array.isArray(patients) ? patients : [];

          const patientMap = new Map<number, string>();

          this.patients.forEach((patient: any) => {

            const name =`${patient.firstName ?? ''} ${patient.lastName ?? ''}`.trim();

            patientMap.set(patient.patientId, name); });

          this.visitService.getVisits().subscribe({
            next: (response: any) => {

              const visits =
                response?.data?.content ??
                response?.data ??
                response ??
                [];

            this.visits = (Array.isArray(visits) ? visits : []).map(
            (visit: Visit) => {

      const patient = patients.find(
        (p: any) =>  String(p.patientId) === String(visit.patientId)
  );

      return {
        ...visit,

        patientName: patient
          ? `${patient.firstName ?? ''} ${patient.lastName ?? ''}`
              .trim()
              .replace(/\s+/g, ' ')
          : `Patient #${visit.patientId}`,

        patientAbhaId: patient?.abhaId ?? '',

        doctorName:
          `${visit.doctorFirstName ?? ''} ${visit.doctorLastName ?? ''}`
            .trim()
            .replace(/\s+/g, ' '),

        visitDate: visit.visitDate
          ? new Date(visit.visitDate).toLocaleDateString('en-IN', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric'
            })
          : ''
      };
    }
  );

  this.filteredVisits = [...this.visits];


              this.filteredVisits = [...this.visits];

              this.loading = false;
            },

            error: (error: any) => {
              this.loading = false;
              this.visits = [];
              this.filteredVisits = [];

              console.error('Failed to load visits', error);
            }
          });
        },

        error: (error: any) => {
          this.loading = false;
          this.patients = [];
          this.visits = [];
          this.filteredVisits = [];

          console.error('Failed to load patients', error);
        }
      });
    }

    

  onSearch(searchValue: string): void {

    const keyword = searchValue
      .trim()
      .toLowerCase()
      .replace(/\s+/g, ' ');

    if (!keyword) {
      this.filteredVisits = [...this.visits];
      return;
    }

    this.filteredVisits = this.visits.filter((visit: any) => {

      const patientName = String(visit.patientName ?? '')
        .trim()
        .toLowerCase()
        .replace(/\s+/g, ' ');

      const abhaId = String(visit.patientAbhaId ?? '')
        .trim()
        .toLowerCase();

      return (
        patientName.includes(keyword) ||
        abhaId.includes(keyword)
      );
    });

    console.log('SEARCH:', keyword);
    console.log('FILTERED VISITS:', this.filteredVisits);
  }


    openCreateForm(): void {
      this.formMode = 'create';
      this.selectedVisit = null;
      this.showForm = true;
    }


    onViewVisit(visit: Visit): void {
      this.selectedVisit = visit;
      this.showDetails = true;
    }


    openEditForm(visit: Visit): void {
      this.formMode = 'edit';
      this.selectedVisit = visit;
      this.showForm = true;
    }


    onVisitSaved(): void {
      this.showForm = false;
      this.selectedVisit = null;
      this.loadVisits();
    }


    onFormCancelled(): void {
      this.showForm = false;
      this.selectedVisit = null;
    }

    

    onDetailsClosed(): void {
      this.showDetails = false;
      this.selectedVisit = null;
    }
  }