import { Component, OnInit } from '@angular/core';
import {
  SharedTableComponent,
  SharedTableConfig,
  TableColumn,
} from '../../../../shared/shared-table/shared-table.component';
import { StaffService } from '../../services/staff.service';
import { STAFF_COLUMNS, TABLE_CONFIG } from '../../config/staff-table.config';
import { StaffFormComponent } from '../../components/staff-form/staff-form.component';
import { Dialog } from 'primeng/dialog';
import { Staff } from '../../models/staff.model';
import { ButtonModule } from 'primeng/button';
import { SharedDetailsComponent } from '../../../../shared/shared-details/shared-details.component';
import { STAFF_DETAIL_FIELDS } from '../../config/staff-form.config';

@Component({
  selector: 'app-staff-list',
  imports: [SharedTableComponent, StaffFormComponent, Dialog, ButtonModule, SharedDetailsComponent],
  templateUrl: './staff-list.component.html',
  styleUrl: './staff-list.component.css',
})
export class StaffListComponent implements OnInit {
  patientColumns: TableColumn[] = STAFF_COLUMNS;
  tableConfig: SharedTableConfig = TABLE_CONFIG;
  staffDetailFields=STAFF_DETAIL_FIELDS;
  staffList: any[] = [];
  loading = false;

  selectedStaff: any = null;

  viewDialogVisible = false;

  ngOnInit(): void {
    this.getAllStaff();
  }

  constructor(private staffService: StaffService) {}

  getAllStaff() {
    this.staffService.getAllStaff().subscribe({
      next: (res: any) => {
        this.staffList = res.data.content;
      },
      error: (error: any) => {},
    });
  }
  onViewStaff(staff: any): void {
    this.selectedStaff = staff;
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

    this.selectedStaff = null;

    this.showForm = true;
  }

  // =========================================================
  // EDIT
  // =========================================================

  openEditForm(bed: Staff): void {
    this.formMode = 'edit';

    this.selectedStaff = {
      ...bed,
    };

    this.showForm = true;
  }

  // =========================================================
  // FORM SAVED
  // =========================================================

  onStaffSaved(): void {
    this.showForm = false;

    this.selectedStaff = null;

    this.getAllStaff();
  }

  // =========================================================
  // FORM CANCELLED
  // =========================================================

  onFormCancelled(): void {
    this.showForm = false;

    this.selectedStaff = null;
  }
}
