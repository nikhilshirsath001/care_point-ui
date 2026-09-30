import { Component, OnInit } from '@angular/core';
import { SharedTableComponent, SharedTableConfig, TableColumn } from '../../../../shared/shared-table/shared-table.component';
import { Dialog } from 'primeng/dialog';
import { SharedDetailsComponent } from '../../../../shared/shared-details/shared-details.component';
import { INPATIENT_COLUMNS, INPATIENT_TABLE_CONFIG } from '../../config/ipd-table.config';
import { INPATIENT_DETAIL_FIELDS } from '../../config/ipd-form.config';
import { IpdService } from '../../services/ipd.service';
import { InpatientFormComponent } from '../../components/inpatient-form/inpatient-form.component';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inpatient-list',
  imports: [SharedTableComponent, Dialog, InpatientFormComponent,ButtonModule, SharedDetailsComponent],
  templateUrl: './inpatient-list.component.html',
  styleUrl: './inpatient-list.component.css'
})
export class InpatientListComponent implements OnInit {
  patientColumns: TableColumn[] = INPATIENT_COLUMNS;
  tableConfig: SharedTableConfig = INPATIENT_TABLE_CONFIG;
  inPatientDetailFields=INPATIENT_DETAIL_FIELDS;
  inPatientList: any[] = [];
  loading = false;

  selectedInPatient: any = null;

  viewDialogVisible = false;
  totalInPatients=100;
  admittedCount=10;
  dischargePendingCount=11;
  transferredCount=80;

  ngOnInit(): void {
    this.getAllInPatient();
  }

  constructor(private ipdService: IpdService,
              private router: Router
  ) {}
openAdmission(): void {
  this.router.navigate(['/main/ipd/admission']);
}
  getAllInPatient() {
    this.ipdService.getAllInPatients().subscribe({
      next: (res: any) => {
        this.inPatientList = res.data;
      },
      error: (error: any) => {},
    });
  }
  onViewInPatient(inPatient: any): void {
    this.selectedInPatient = inPatient;
    this.viewDialogVisible = true;
  }

  // =========================================================
  // FORM
  // =========================================================

  showForm = false;

  formMode: 'create' | 'edit' = 'create';


  // =========================================================
  // CREATE
  // =========================================================

  openCreateForm(): void {
    this.formMode = 'create';

    this.selectedInPatient = null;

    this.showForm = true;
  }

  // =========================================================
  // EDIT
  // =========================================================

  openEditForm(inPatient: any): void {
    this.formMode = 'edit';

    this.selectedInPatient = {
      ...inPatient,
    };

    this.showForm = true;
  }

  // =========================================================
  // FORM SAVED
  // =========================================================

  onInPatientSaved(): void {
    this.showForm = false;

    this.selectedInPatient = null;

    this.getAllInPatient();
  }

  // =========================================================
  // FORM CANCELLED
  // =========================================================

  onFormCancelled(): void {
    this.showForm = false;

    this.selectedInPatient = null;
  }
}

