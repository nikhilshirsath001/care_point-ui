import { Component, OnInit } from '@angular/core';
import { SharedTableComponent, SharedTableConfig, TableColumn } from '../../../../shared/shared-table/shared-table.component';
import { Dialog } from 'primeng/dialog';
import { DepartmentFormComponent } from '../../components/department-form/department-form.component';
import { AdministratorService } from '../../services/administrator.service';
import { DEPARTMENT_COLUMNS, TABLE_CONFIG } from '../../config/department-table.config';
import { Department } from '../../models/department.model';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-department',
  imports: [SharedTableComponent, Dialog, DepartmentFormComponent,ButtonModule],
  templateUrl: './department.component.html',
  styleUrl: './department.component.css'
})
export class DepartmentComponent  implements OnInit {


  // =========================================================
  // TABLE
  // =========================================================

  departmentColumns: TableColumn[] = DEPARTMENT_COLUMNS;

  tableConfig: SharedTableConfig = TABLE_CONFIG;


  // =========================================================
  // DATA
  // =========================================================

  departmentList: Department[] = [];

  loading = false;


  // =========================================================
  // FORM
  // =========================================================

  showForm = false;

  formMode: 'create' | 'edit' = 'create';

  selectedBed: Department | null = null;


  constructor(
    private administratorService: AdministratorService
  ) {}


  // =========================================================
  // INIT
  // =========================================================

  ngOnInit(): void {

    this.loadDepartments();

  }


  // =========================================================
  // LOAD BEDS
  // =========================================================

  loadDepartments(): void {

    this.loading = true;

    this.administratorService
      .getAllDepartments()
      .subscribe({

        next: (response:any) => {

          this.departmentList =
            response?.data?.content ?? [];

          this.loading = false;

        },

        error: (error:any) => {

          console.error(
            'Failed to load beds',
            error
          );

          this.loading = false;

        }

      });

  }


  // =========================================================
  // CREATE
  // =========================================================

  openCreateForm(): void {

    this.formMode = 'create';

    this.selectedBed = null;

    this.showForm = true;

  }


  // =========================================================
  // EDIT
  // =========================================================

  openEditForm(
    bed: Department
  ): void {

    this.formMode = 'edit';

    this.selectedBed = {
      ...bed
    };

    this.showForm = true;

  }


  // =========================================================
  // FORM SAVED
  // =========================================================

  onBedSaved(): void {

    this.showForm = false;

    this.selectedBed = null;

    this.loadDepartments();

  }


  // =========================================================
  // FORM CANCELLED
  // =========================================================

  onFormCancelled(): void {

    this.showForm = false;

    this.selectedBed = null;

  }

}