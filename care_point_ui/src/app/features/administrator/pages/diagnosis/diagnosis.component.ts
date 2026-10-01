import { Component, OnInit } from '@angular/core';
import { SharedDetailsComponent } from '../../../../shared/shared-details/shared-details.component';
import { DiagnosisFormComponent } from '../../components/diagnosis-form/diagnosis-form.component';
import { SharedTableConfig, TableColumn, SharedTableComponent } from '../../../../shared/shared-table/shared-table.component';
import { AdministratorService } from '../../services/administrator.service';
import { DIAGNOSIS_DETAIL_FIELDS } from '../../config/diagnosis-form.config';
import { TABLE_CONFIG } from '../../config/department-table.config';
import { DIAGNOSIS_COLUMNS } from '../../config/diagnosis-table.config';
import { Dialog } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-diagnosis',
  imports: [SharedDetailsComponent, DiagnosisFormComponent, SharedTableComponent, ButtonModule, Dialog],
  templateUrl: './diagnosis.component.html',
  styleUrl: './diagnosis.component.css'
})
export class DiagnosisComponent implements OnInit {
  patientColumns: TableColumn[] = DIAGNOSIS_COLUMNS;
  tableConfig: SharedTableConfig = TABLE_CONFIG;
  DiagnosisDetailFields=DIAGNOSIS_DETAIL_FIELDS;
  diagnosisList: any[] = [];
  loading = false;

  selectedDiagnosis: any = null;

  viewDialogVisible = false;

  ngOnInit(): void {
    this.getAllDiagnosis();
  }

  constructor(private administratorService: AdministratorService) {}

  getAllDiagnosis() {
    this.administratorService.getAllDiagnosis().subscribe({
      next: (res: any) => {
        this.diagnosisList = res?.data ?? [];
      },
      error: (error: any) => {},
    });
  }
  onViewDiagnosis(Diagnosis: any): void {
    this.selectedDiagnosis = Diagnosis;
    this.viewDialogVisible = true;
  }



  showForm = false;

  formMode: 'create' | 'edit' = 'create';



  openCreateForm(): void {
    this.formMode = 'create';

    this.selectedDiagnosis = null;

    this.showForm = true;
  }



  openEditForm(Diagnosis: any): void {
    this.formMode = 'edit';

    this.selectedDiagnosis = {
      ...Diagnosis,
    };

    this.showForm = true;
  }


  onDiagnosisSaved(): void {
    this.showForm = false;

    this.selectedDiagnosis = null;

    this.getAllDiagnosis();
  }


  onFormCancelled(): void {
    this.showForm = false;

    this.selectedDiagnosis = null;
  }
}
