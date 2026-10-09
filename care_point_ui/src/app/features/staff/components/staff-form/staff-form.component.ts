import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { DynamicFormComponent } from '../../../../shared/dynamic-form/dynamic-form.component';
import { Staff } from '../../models/staff.model';
import { DynamicFormConfig } from '../../../../core/models/dynamic-form.model';
import { StaffService } from '../../services/staff.service';
import { STAFF_FORM_CONFIG } from '../../config/staff-form.config';
import { AdministratorService } from '../../../administrator/services/administrator.service';

@Component({
  selector: 'app-staff-form',
  imports: [DynamicFormComponent],
  templateUrl: './staff-form.component.html',
  styleUrl: './staff-form.component.css',
})
export class StaffFormComponent implements OnChanges {
  // =========================================================
  // INPUTS
  // =========================================================

  @Input()
  mode: 'create' | 'edit' = 'create';

  @Input()
  staff: Staff | null = null;

  // =========================================================
  // OUTPUTS
  // =========================================================

  @Output()
  saved = new EventEmitter<void>();

  @Output()
  cancelled = new EventEmitter<void>();

  // =========================================================
  // FORM
  // =========================================================

  formConfig: DynamicFormConfig = {
    ...STAFF_FORM_CONFIG,

    fields: STAFF_FORM_CONFIG.fields.map((field) => ({
      ...field,

      options: field.options ? [...field.options] : undefined,
    })),
  };

  loading = false;

  constructor(
    private staffService: StaffService,
    private administratorService: AdministratorService,
  ) {}

  // =========================================================
  // INPUT CHANGE
  // =========================================================

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['mode'] || changes['bed']) {
      this.prepareForm();
    }
  }

  // =========================================================
  // PREPARE FORM
  // =========================================================

  private prepareForm(): void {
    this.loadDepartmentOptions();
    this.loadRoleOptions();
  }

  private loadRoleOptions() {
    this.administratorService.getAllRoles().subscribe({
      next: (response) => {
        const departments = response?.data?.content ?? [];

        const field = this.formConfig.fields.find(
          (field) => field.name === 'roleId',
        );

        if (field) {
          field.options = departments.map((role: any) => ({
            label: role.roleName,

            value: role.roleId,
          }));
        }
      },
      error: (error: any) => {
        console.log('error occured');
      },
    });
  }

  private loadDepartmentOptions() {
    this.administratorService.getAllDepartments().subscribe({
      next: (response) => {
        const departments = response?.data?.content ?? [];

        const field = this.formConfig.fields.find(
          (field) => field.name === 'departmentId',
        );

        if (field) {
          field.options = departments.map((ward: any) => ({
            label: ward.departmentName,

            value: ward.departmentId,
          }));
        }

        //       /*
        //        * If editing a bed,
        //        * load rooms for its ward.
        //        */

        //       if (
        //         this.mode === 'edit' &&
        //         this.bed?.wardId
        //       ) {

        //         this.loadRoomOptions(
        //           this.bed.wardId
        //         );

        //       }
      },

      error: (error: any) => {
        console.error('Failed to load departments', error);
      },
    });
  }

  // =========================================================
  // FORM SUBMIT
  // =========================================================

  onSubmit(formData: Record<string, any>): void {
    this.loading = true;

    if (this.mode === 'create') {
      this.createDepartment(formData);
    } else {
      this.updateBed(formData);
    }
  }

  // =========================================================
  // CREATE BED
  // =========================================================

  private createDepartment(formData: Record<string, any>): void {
    this.staffService.createStaff(formData as Staff).subscribe({
      next: () => {
        this.loading = false;

        this.saved.emit();
      },

      error: (error: any) => {
        this.loading = false;

        console.error('Failed to create bed', error);
      },
    });
  }

  // =========================================================
  // UPDATE BED
  // =========================================================

  private updateBed(formData: Record<string, any>): void {
    if (!this.staff?.id) {
      console.error('Bed ID is missing');

      this.loading = false;

      return;
    }

    // this.bedWardService
    //   .updateBed(
    //     this.bed.id,
    //     formData as Bed
    //   )
    //   .subscribe({

    //     next: () => {

    //       this.loading = false;

    //       this.saved.emit();

    //     },

    //     error: (error) => {

    //       this.loading = false;

    //       console.error(
    //         'Failed to update bed',
    //         error
    //       );

    //     }

    //   });
  }

  // =========================================================
  // CANCEL
  // =========================================================

  onCancel(): void {
    this.cancelled.emit();
  }
}
