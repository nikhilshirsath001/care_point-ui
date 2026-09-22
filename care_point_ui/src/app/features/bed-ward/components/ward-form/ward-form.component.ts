import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { DynamicFormComponent } from '../../../../shared/dynamic-form/dynamic-form.component';
import { CommonModule } from '@angular/common';
import { BedWardService } from '../../services/bed-ward.service';
import { DynamicFormConfig } from '../../../../core/models/dynamic-form.model';
import { WARD_FORM_CONFIG } from '../../config/ward-form.config';
import { Ward } from '../../models/ward.model';

@Component({
  selector: 'app-ward-form',
  imports: [
     CommonModule,
    DynamicFormComponent
  ],
  templateUrl: './ward-form.component.html',
  styleUrl: './ward-form.component.css'
})
export class WardFormComponent  implements OnChanges {

  // =========================================================
  // INPUTS
  // =========================================================

  @Input()
  mode: 'create' | 'edit' = 'create';

  @Input()
  ward: Ward | null = null;


  // =========================================================
  // OUTPUTS
  // =========================================================

  @Output()
  saved = new EventEmitter<void>();

  @Output()
  cancelled = new EventEmitter<void>();


  // =========================================================
  // FORM CONFIGURATION
  // =========================================================

  formConfig: DynamicFormConfig = {
    ...WARD_FORM_CONFIG,

    fields: WARD_FORM_CONFIG.fields.map(field => ({
      ...field,
      options: field.options
        ? [...field.options]
        : undefined
    }))
  };


  // =========================================================
  // STATE
  // =========================================================

  loading = false;


  // =========================================================
  // CONSTRUCTOR
  // =========================================================

  constructor(
    private bedWardService: BedWardService
  ) {}


  // =========================================================
  // INPUT CHANGE
  // =========================================================

  ngOnChanges(changes: SimpleChanges): void {

    if (
      changes['mode'] ||
      changes['ward']
    ) {
      this.prepareForm();
    }

  }


  // =========================================================
  // PREPARE FORM
  // =========================================================

  private prepareForm(): void {

    // Reset form configuration if required
    this.formConfig = {
      ...WARD_FORM_CONFIG,

      fields: WARD_FORM_CONFIG.fields.map(field => ({
        ...field,
        options: field.options
          ? [...field.options]
          : undefined
      }))
    };

  }


  // =========================================================
  // FORM SUBMIT
  // =========================================================

  onSubmit(
    formData: Record<string, any>
  ): void {

    this.loading = true;

    if (this.mode === 'create') {

      this.createWard(formData);

    } else {

      this.updateWard(formData);

    }

  }


  // =========================================================
  // CREATE WARD
  // =========================================================

  private createWard(
    formData: Record<string, any>
  ): void {

    // this.bedWardService
    //   .createWard(formData as Ward)
    //   .subscribe({

    //     next: () => {

    //       this.loading = false;

    //       this.saved.emit();

    //     },

    //     error: (error) => {

    //       this.loading = false;

    //       console.error(
    //         'Failed to create ward',
    //         error
    //       );

    //     }

    //   });

  }


  // =========================================================
  // UPDATE WARD
  // =========================================================

  private updateWard(
    formData: Record<string, any>
  ): void {

    if (!this.ward?.id) {

      console.error(
        'Ward ID is missing'
      );

      this.loading = false;

      return;
    }


    // this.bedWardService
    //   .updateWard(
    //     this.ward.id,
    //     formData as Ward
    //   )
    //   .subscribe({

    //     next: () => {

    //       this.loading = false;

    //       this.saved.emit();

    //     },

    //     error: (error) => {

    //       this.loading = false;

    //       console.error(
    //         'Failed to update ward',
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