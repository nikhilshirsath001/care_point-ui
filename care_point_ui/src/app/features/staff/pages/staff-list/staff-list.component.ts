import { Component, OnInit } from '@angular/core';

import {
  SharedTableComponent,
  SharedTableConfig,
  TableColumn,
} from '../../../../shared/shared-table/shared-table.component';

import { StaffService } from '../../services/staff.service';

import { STAFF_COLUMNS, TABLE_CONFIG } from '../../config/staff-table.config';

import {
  STAFF_DETAIL_FIELDS,
  STAFF_FORM_CONFIG,
} from '../../config/staff-form.config';

import { Dialog } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

import { SharedDetailsComponent } from '../../../../shared/shared-details/shared-details.component';

import { DynamicFormComponent } from '../../../../shared/dynamic-form/dynamic-form.component';

import { DynamicFormConfig } from '../../../../core/models/dynamic-form.model';

import { AdministratorService } from '../../../administrator/services/administrator.service';
import { TabsModule } from 'primeng/tabs';

@Component({
  selector: 'app-staff-list',
  imports: [
    SharedTableComponent,
    Dialog,
    ButtonModule,
    SharedDetailsComponent,
    DynamicFormComponent,
    TabsModule,
  ],
  templateUrl: './staff-list.component.html',
  styleUrl: './staff-list.component.css',
})
export class StaffListComponent implements OnInit {
  patientColumns: TableColumn[] = STAFF_COLUMNS;

  activeTableConfig: SharedTableConfig = {
    ...TABLE_CONFIG,
    canDelete: false,
    canDeactivate: true,
  };

  inactiveTableConfig: SharedTableConfig = {
    ...TABLE_CONFIG,
    canActivate: true,
  };

  staffDetailFields = STAFF_DETAIL_FIELDS;

  staffList: any[] = [];
  activeStaffList: any[] = [];
  inactiveStaffList: any[] = [];

  activeTab = '0';

  loading = false;

  staffFormFields: DynamicFormConfig = {
    ...STAFF_FORM_CONFIG,
    fields: STAFF_FORM_CONFIG.fields.map((field) => ({
      ...field,
      options: field.options ? [...field.options] : undefined,
    })),
  };

  selectedStaff: any = null;

  showForm = false;

  formMode: 'create' | 'edit' = 'create';

  viewDialogVisible = false;

  currentPage = 0;

  currentPageSize = 20;

  private rolesLoaded = false;

  private departmentsLoaded = false;
  originalStaffData: any = null;
  private departmentOptions: any[] = [];
  private roleOptions: any[] = [];

  constructor(
    private staffService: StaffService,
    private administratorService: AdministratorService,
  ) {}

  ngOnInit(): void {
    this.getAllStaff();
    this.loadDepartmentOptions();
    this.loadRoleOptions();
  }

  getAllStaff(): void {
    this.loading = true;

    this.staffService
      .getAllStaff(
        this.currentPage,
        this.currentPageSize,
        this.activeTab === '0',
      )
      .subscribe({
        next: (response: any) => {
          const staff = response?.data?.content ?? [];

          if (this.activeTab === '0') {
            this.activeStaffList = staff;
          } else {
            this.inactiveStaffList = staff;
          }

          this.loading = false;
        },
        error: (error: any) => {
          this.loading = false;
          console.error('Failed to load staff:', error);
        },
      });
  }

  private loadDepartmentOptions(): void {
    this.administratorService.getAllDepartments().subscribe({
      next: (response: any) => {
        const departments = response?.data?.content ?? [];

        const field = this.staffFormFields.fields.find(
          (field) => field.name === 'departmentId',
        );

        if (field) {
          this.departmentOptions = departments.map((department: any) => ({
            label: department.departmentName,
            value: department.departmentId,
          }));
          field.options = departments.map((department: any) => ({
            label: department.departmentName,
            value: department.departmentId,
          }));
        }

        this.departmentsLoaded = true;
      },
      error: (error: any) => {
        console.error('Failed to load departments:', error);
      },
    });
  }

  private loadRoleOptions(): void {
    this.administratorService.getAllRoles().subscribe({
      next: (response: any) => {
        const roles = response?.data?.content ?? [];

        const field = this.staffFormFields.fields.find(
          (field) => field.name === 'roleId',
        );

        if (field) {
          this.roleOptions = roles.map((role: any) => ({
            label: role.roleName,
            value: role.roleId,
          }));
          field.options = roles.map((role: any) => ({
            label: role.roleName,
            value: role.roleId,
          }));
        }

        this.rolesLoaded = true;
      },
      error: (error: any) => {
        console.error('Failed to load roles:', error);
      },
    });
  }

  private areOptionsLoaded(): boolean {
    return this.rolesLoaded && this.departmentsLoaded;
  }

  onViewTable(staff: any): void {
    this.selectedStaff = staff;
    this.viewDialogVisible = true;
  }

  onCreateTable(): void {
    if (!this.areOptionsLoaded()) {
      console.warn('Please wait. Loading departments and roles.');
      return;
    }

    this.staffFormFields = {
      ...STAFF_FORM_CONFIG,
      fields: STAFF_FORM_CONFIG.fields.map((field) => ({
        ...field,
        options:
          field.name === 'departmentId'
            ? [...this.departmentOptions]
            : field.name === 'roleId'
              ? [...this.roleOptions]
              : field.options
                ? [...field.options]
                : undefined,
        defaultValue: null,
      })),
    };

    this.formMode = 'create';
    this.selectedStaff = null;
    this.originalStaffData = null;
    this.showForm = true;
  }

  OnEditTable(record: any): void {
    if (!this.areOptionsLoaded()) {
      console.warn('Please wait. Loading departments and roles.');
      return;
    }

    this.formMode = 'edit';

    const roleField = this.staffFormFields.fields.find(
      (field) => field.name === 'roleId',
    );

    const matchedRole = roleField?.options?.find(
      (option: any) =>
        option.label?.toUpperCase() === record.roleName?.toUpperCase(),
    );

    this.selectedStaff = {
      ...record,
      staffId: record.staffId,
      departmentId: record.department?.departmentId ?? null,
      roleId: matchedRole?.value ?? null,
    };

    this.originalStaffData = structuredClone(this.selectedStaff);

    this.showForm = true;
  }

  onStaffSaved(formData: Record<string, any>): void {
    // console.log('Staff saved:', formData);
    if (!formData) {
      console.error('Staff form data is missing.');
      return;
    }

    const { staffId, department, roleName, ...payload } = formData;

    if (!payload['roleId'] || !payload['departmentId']) {
      console.error('Role and department are required.');
      return;
    }

    this.loading = true;

    if (this.formMode === 'create') {
      this.staffService.createStaff(payload).subscribe({
        next: () => {
          this.handleSaveSuccess('Staff created successfully.');
        },
        error: (error: any) => {
          this.handleSaveError('Failed to create staff:', error);
        },
      });

      return;
    }

    const id = this.selectedStaff?.staffId;

    if (!id) {
      this.loading = false;
      console.error('Staff ID is missing for update.');
      return;
    }

    this.staffService.updateStaff(id, payload).subscribe({
      next: () => {
        this.handleSaveSuccess('Staff updated successfully.');
      },
      error: (error: any) => {
        this.handleSaveError('Failed to update staff:', error);
      },
    });
  }

  private handleSaveSuccess(message: string): void {
    this.loading = false;
    // console.log(message);

    this.showForm = false;
    this.selectedStaff = null;
    this.originalStaffData = null;

    this.getAllStaff();
  }

  private handleSaveError(message: string, error: any): void {
    this.loading = false;
    console.error(message, error);
  }

  onFormCancelled(): void {
    this.showForm = false;
    this.selectedStaff = null;
  }

  onDeactivateTable(record: any): void {
    const staffId = record?.staffId;

    if (!staffId) {
      console.error('Staff ID is missing.');
      return;
    }

    const confirmDelete = window.confirm(
      `Are you sure you want to ${record.active ? 'deactivate' : 'activate'} ${record.firstName} ${record.lastName}?`,
    );

    if (!confirmDelete) {
      return;
    }

    this.loading = true;

    this.staffService.changeStaffStatus(staffId, !record.active).subscribe({
      next: () => {
        // console.log('Staff status updated successfully.');

        if (this.staffList.length === 1 && this.currentPage > 0) {
          this.currentPage--;
        }

        this.getAllStaff();
      },
      error: (error: any) => {
        this.loading = false;
        console.error('Failed to update staff status:', error);
      },
    });
  }

  onPageChangeTable(event: {
    page: number;
    size: number;
    first: number;
  }): void {
    this.currentPage = event.page;
    this.currentPageSize = event.size;
    this.getAllStaff();
  }

  onSearchTable(searchValue: string): void {
    const search = searchValue.trim();

    this.currentPage = 0;

    if (!search) {
      this.getAllStaff();
      return;
    }

    if (search.length <= 4) {
      return;
    }

    this.loading = true;

    this.staffService
      .searchStaff(search, this.currentPage, this.currentPageSize)
      .subscribe({
        next: (response: any) => {
          this.staffList = response?.data?.content ?? [];
          this.loading = false;
        },
        error: (error: any) => {
          this.loading = false;
          console.error('Failed to search staff:', error);
        },
      });
  }

  onRefreshTable(): void {
    this.currentPage = 0;
    this.getAllStaff();
  }

  onFormReset(): void {
    if (this.formMode === 'edit' && this.originalStaffData) {
      this.selectedStaff = structuredClone(this.originalStaffData);
    } else {
      this.selectedStaff = null;
    }
  }

  onDeleteRecordPermanently(record: any): void {
    const staffId = record?.staffId;

    if (!staffId) {
      console.error('Staff ID is missing.');
      return;
    }
    // tell user this record will delete permanently.
    const confirmDelete = window.confirm(
      `Are you sure you want to permanently delete ${record.firstName} ${record.lastName}? This action cannot be undone.`,
    );

    if (!confirmDelete) {
      return;
    }

    this.loading = true;

    this.staffService.deleteStaff(staffId).subscribe({
      next: () => {
        // console.log('Staff deleted successfully.');

        if (this.staffList.length === 1 && this.currentPage > 0) {
          this.currentPage--;
        }

        this.getAllStaff();
      },
      error: (error: any) => {
        this.loading = false;
        console.error('Failed to delete staff:', error);
      },
    });
  }
  onTabChange(event: any): void {
    this.activeTab = event.index || event;
    this.currentPage = 0;
    this.getAllStaff();
  }
}
