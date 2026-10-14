import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';

import { DynamicFormComponent } from '../../../../shared/dynamic-form/dynamic-form.component';

import { MedicationModel } from '../../models/medication.model';

import { MedicationService } from '../../services/medication.service';

import { MEDICATION_FORM_CONFIG } from '../../configs/medication-form.config';

@Component({
  selector: 'app-medication-form',

  standalone: true,

  imports: [DynamicFormComponent],

  templateUrl: './medication-form.component.html',

  styleUrl: './medication-form.component.css',
})
export class MedicationFormComponent implements OnChanges {
  // ========================================================
  // INPUTS
  // ========================================================

  @Input()
  mode: 'create' | 'edit' = 'create';

  @Input()
  medication: MedicationModel | null = null;

  // ========================================================
  // OUTPUTS
  // ========================================================

  @Output()
  saved = new EventEmitter<void>();

  @Output()
  cancelled = new EventEmitter<void>();

  // ========================================================
  // FORM CONFIGURATION
  // ========================================================

  formConfig = MEDICATION_FORM_CONFIG;

  // ========================================================
  // LOADING
  // ========================================================

  loading = false;

  // ========================================================
  // FORM DATA
  // ========================================================

  formData: Record<string, any> = {};

  constructor(private medicationService: MedicationService) {}

  // ========================================================
  // INPUT CHANGES
  // ========================================================

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['mode'] || changes['medication']) {
      this.prepareForm();
    }
  }

  // ========================================================
  // PREPARE FORM
  // ========================================================

  private prepareForm(): void {
    if (this.mode === 'edit' && this.medication) {
      this.formData = {
        name: this.medication.name ?? this.medication.name ?? '',

        genericName: this.medication.genericName ?? '',

        strength: this.medication.strength ?? '',

        active: this.medication.active ?? true,
      };
    } else {
      this.formData = {
        name: '',

        genericName: '',

        strength: '',

        active: true,
      };
    }
  }

  // ========================================================
  // SUBMIT
  // ========================================================

  onSubmit(formData: Record<string, any>): void {
    console.log('MEDICATION FORM SUBMITTED:', formData);

    const request = {
      name: formData['name'],

      genericName: formData['genericName'],

      strength: formData['strength'],

      active: formData['active'] ?? true,
    };

    this.loading = true;

    if (this.mode === 'create') {
      this.createMedication(request);
    } else {
      this.updateMedication(request);
    }
  }

  // ========================================================
  // CREATE
  // ========================================================

  private createMedication(request: any): void {
    this.medicationService.createMedication(request).subscribe({
      next: (response: any) => {
        console.log('CREATE MEDICATION RESPONSE:', response);

        this.loading = false;

        this.saved.emit();
      },

      error: (error: any) => {
        console.error('CREATE MEDICATION ERROR:', error);

        this.loading = false;
      },
    });
  }

  // ========================================================
  // UPDATE
  // ========================================================

  private updateMedication(request: any): void {
    const medicationId = this.medication?.medicationId;

    if (medicationId === undefined || medicationId === null) {
      console.error('Medication ID is missing. Cannot update medication.');

      this.loading = false;

      return;
    }

    this.medicationService.updateMedication(medicationId, request).subscribe({
      next: (response: any) => {
        console.log('UPDATE MEDICATION RESPONSE:', response);

        this.loading = false;

        this.saved.emit();
      },

      error: (error: any) => {
        console.error('UPDATE MEDICATION ERROR:', error);

        this.loading = false;
      },
    });
  }

  // ========================================================
  // CANCEL
  // ========================================================

  onCancel(): void {
    this.cancelled.emit();
  }
}
