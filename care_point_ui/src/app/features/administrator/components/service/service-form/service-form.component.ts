import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { DynamicFormComponent } from '../../../../../shared/dynamic-form/dynamic-form.component';
import { SERVICE_FORM_CONFIG } from '../../../config/service-form.config';
import { DynamicFormConfig } from '../../../../../core/models/dynamic-form.model';
import { AdministratorService } from '../../../services/administrator.service';

@Component({
  selector: 'app-service-form',
  imports: [DynamicFormComponent],
  templateUrl: './service-form.component.html',
  styleUrl: './service-form.component.css'
})
export class ServiceFormComponent  implements OnChanges {


  // =========================================================
  // INPUTS
  // =========================================================

  @Input()
  mode: 'create' | 'edit' = 'create';


  @Input()
  service: any | null = null;


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
    ...SERVICE_FORM_CONFIG,

    fields: SERVICE_FORM_CONFIG.fields.map(
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
    private administratorService: AdministratorService
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
    this.loadServiceCategories();
    this.loadWardOptions();
    this.loadDepartmentOptions();

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

  private loadDepartmentOptions(){
        this.administratorService.getAllDepartments().subscribe({

        next: (response) => {

          const departments =response?.data?.content ?? [];;

          const field =
            this.formConfig.fields.find(
              field =>
                field.name === 'departmentId'
            );

          if (field) {

            field.options =
              departments.map(
                (ward: any) => ({

                  label: ward.departmentName,

                  value: ward.departmentId

                })
              );

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

        error: (error:any) => {

          console.error(
            'Failed to load departments',
            error
          );

        }

      });

  }

  private loadServiceCategories(){
       this.administratorService.getAllServiceCategories().subscribe({

        next: (response) => {

          const departments =response?.data ?? [];;

          const field =
            this.formConfig.fields.find(
              field =>
                field.name === 'serviceCategoryId'
            );

          if (field) {

            field.options =
              departments.map(
                (ward: any) => ({
                  label: ward.categoryName,
                  value: ward.serviceCategoryId
                })
              );

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

        error: (error:any) => {

          console.error(
            'Failed to load departments',
            error
          );

        }

      });
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

    this.administratorService
      .createService(
        formData 
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

    if (!this.service?.id) {

      console.error(
        'Bed ID is missing'
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