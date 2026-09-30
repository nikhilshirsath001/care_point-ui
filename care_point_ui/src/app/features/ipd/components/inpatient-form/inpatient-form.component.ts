import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { DynamicFormComponent } from '../../../../shared/dynamic-form/dynamic-form.component';
import { DynamicFormConfig } from '../../../../core/models/dynamic-form.model';
import { INPATIENT_FORM_CONFIG } from '../../config/ipd-form.config';
import { IpdService } from '../../services/ipd.service';
import { StaffService } from '../../../staff/services/staff.service';

@Component({
  selector: 'app-inpatient-form',
  imports: [DynamicFormComponent],
  templateUrl: './inpatient-form.component.html',
  styleUrl: './inpatient-form.component.css'
})
export class InpatientFormComponent implements OnChanges {


  // =========================================================
  // INPUTS
  // =========================================================

  @Input()
  mode: 'create' | 'edit' = 'create';


  @Input()
  inPatient: any | null = null;


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
    ...INPATIENT_FORM_CONFIG,

    fields: INPATIENT_FORM_CONFIG.fields.map(
      field => ({
        ...field,

        options: field.options
          ? [...field.options]
          : undefined
      })
    )
  };


  loading = false;


  constructor(
    private staffService: StaffService,
    private ipdService: IpdService
  ) {}


  // =========================================================
  // INPUT CHANGE
  // =========================================================

  ngOnChanges(
    changes: SimpleChanges
  ): void {

    if (
      changes['mode'] ||
      changes['bed']
    ) {

      this.prepareForm();

    }

  }


  // =========================================================
  // PREPARE FORM
  // =========================================================

  private prepareForm(): void {
    this.loadWardOptions();
  }


  // =========================================================
  // LOAD WARDS
  // =========================================================

  private loadWardOptions(): void {

    // this.bedWardService
    //   .getWards()
    //   .subscribe({

    //     next: (response) => {

    //       const wards =
    //         response?.data ?? [];

    //       const field =
    //         this.formConfig.fields.find(
    //           field =>
    //             field.name === 'wardId'
    //         );

    //       if (field) {

    //         field.options =
    //           wards.map(
    //             (ward: any) => ({

    //               label: ward.name,

    //               value: ward.id

    //             })
    //           );

    //       }


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

    //     },

    //     error: (error:any) => {

    //       console.error(
    //         'Failed to load wards',
    //         error
    //       );

    //     }

    //   });

  }


  // =========================================================
  // LOAD ROOMS
  // =========================================================

  private loadRoomOptions(
    wardId: number
  ): void {

    // this.bedWardService
    //   .getRoomsByWard(wardId)
    //   .subscribe({

    //     next: (response) => {

    //       const rooms =
    //         response?.data ?? [];

    //       const field =
    //         this.formConfig.fields.find(
    //           field =>
    //             field.name === 'roomId'
    //         );

    //       if (field) {

    //         field.options =
    //           rooms.map(
    //             (room: any) => ({

    //               label:
    //                 room.roomNumber,

    //               value:
    //                 room.id

    //             })
    //           );

    //       }

    //     },

    //     error: (error) => {

    //       console.error(
    //         'Failed to load rooms',
    //         error
    //       );

    //     }

    //   });

  }


  // =========================================================
  // FORM SUBMIT
  // =========================================================

  onSubmit(
    formData: Record<string, any>
  ): void {

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

  private createDepartment(
    formData: Record<string, any>
  ): void {

    this.staffService
      .createStaff(
        formData as any
      )
      .subscribe({

        next: () => {

          this.loading = false;

          this.saved.emit();

        },

        error: (error:any) => {

          this.loading = false;

          console.error(
            'Failed to create bed',
            error
          );

        }

      });

  }


  // =========================================================
  // UPDATE BED
  // =========================================================

  private updateBed(
    formData: Record<string, any>
  ): void {

    if (!this.inPatient?.id) {

      console.error(
        'InPatient ID is missing'
      );

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
