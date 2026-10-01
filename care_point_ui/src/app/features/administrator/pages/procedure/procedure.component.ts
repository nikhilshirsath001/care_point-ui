import { Component, OnInit } from '@angular/core';
import { PROCEDURE_COLUMNS } from '../../config/procedure-table.config';
import { SharedTableConfig, TableColumn, SharedTableComponent } from '../../../../shared/shared-table/shared-table.component';
import { TABLE_CONFIG } from '../../config/department-table.config';
import { PROCEDURE_DETAIL_FIELDS } from '../../config/procedure-form.config';
import { AdministratorService } from '../../services/administrator.service';
import { SharedDetailsComponent } from '../../../../shared/shared-details/shared-details.component';
import { Dialog } from 'primeng/dialog';
import { ProcedureFormComponent } from '../../components/procedure-form/procedure-form.component';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-procedure',
  imports: [SharedDetailsComponent, Dialog, SharedTableComponent,ButtonModule, ProcedureFormComponent],
  templateUrl: './procedure.component.html',
  styleUrl: './procedure.component.css'
})
export class ProcedureComponent  implements OnInit {
  patientColumns: TableColumn[] = PROCEDURE_COLUMNS;
  tableConfig: SharedTableConfig = TABLE_CONFIG;
  procedureDetailFields=PROCEDURE_DETAIL_FIELDS;
  procedureList: any[] = [];
  loading = false;

  selectedProcedure: any = null;

  viewDialogVisible = false;

  ngOnInit(): void {
    this.getAllProcedure();
  }

  constructor(private administratorService: AdministratorService) {}

  getAllProcedure() {
    this.administratorService.getAllProcedures().subscribe({
      next: (res: any) => {
        this.procedureList = res?.data ?? [];
      },
      error: (error: any) => {},
    });
  }
  onViewProcedure(Procedure: any): void {
    this.selectedProcedure = Procedure;
    this.viewDialogVisible = true;
  }



  showForm = false;

  formMode: 'create' | 'edit' = 'create';



  openCreateForm(): void {
    this.formMode = 'create';

    this.selectedProcedure = null;

    this.showForm = true;
  }



  openEditForm(procedure: any): void {
    this.formMode = 'edit';

    this.selectedProcedure = {
      ...procedure,
    };

    this.showForm = true;
  }


  onProcedureSaved(): void {
    this.showForm = false;

    this.selectedProcedure = null;

    this.getAllProcedure();
  }


  onFormCancelled(): void {
    this.showForm = false;

    this.selectedProcedure = null;
  }
}
