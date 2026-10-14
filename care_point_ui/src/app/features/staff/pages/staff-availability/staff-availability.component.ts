import { Component, OnInit } from '@angular/core';
import { SharedTableComponent, SharedTableConfig, TableColumn } from '../../../../shared/shared-table/shared-table.component';
import { SharedDetailsComponent } from '../../../../shared/shared-details/shared-details.component';
import { Staff } from '../../models/staff.model';
import { STAFF_DETAIL_FIELDS } from '../../config/staff-form.config';
import { STAFF_COLUMNS, TABLE_CONFIG } from '../../config/staff-table.config';
import { StaffService } from '../../services/staff.service';
import { STAFF_SCHEDULE_DETAIL_FIELDS } from '../../config/staff-schedule-form.config';
import { STAFF_SCHEDULE_COLUMNS } from '../../config/staff-schedule-table.config';
import { STAFF_AVAILABILITY_COLUMNS, STAFF_AVAILABILITY_DETAIL_FIELDS } from '../../config/staff-availabIlity-table.config';

@Component({
  selector: 'app-staff-availability',
  imports: [SharedTableComponent, SharedDetailsComponent],
  templateUrl: './staff-availability.component.html',
  styleUrl: './staff-availability.component.css'
})
export class StaffAvailabilityComponent implements OnInit {
  patientColumns: TableColumn[] = STAFF_AVAILABILITY_COLUMNS;
  tableConfig: SharedTableConfig = TABLE_CONFIG;
  staffDetailFields=STAFF_AVAILABILITY_DETAIL_FIELDS;
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
