import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';

import { DynamicFormComponent } from '../../../../shared/dynamic-form/dynamic-form.component';
import { Floor } from '../../models/floor.model';
import { BedWardService } from '../../services/bed-ward.service';
import { FLOOR_FORM_CONFIG } from '../../config/floor-form.config';

@Component({
  selector: 'app-floor-form',
  standalone: true,
  imports: [CommonModule, DynamicFormComponent],
  templateUrl: './floor-form.component.html',
})
export class FloorFormComponent implements OnChanges {
  @Input() mode: 'create' | 'edit' = 'create';
  @Input() floor: Floor | null = null;

  @Output() saved = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  formConfig = FLOOR_FORM_CONFIG;
  formData: Partial<Floor> = {};
  loading = false;

  constructor(private readonly bedWardService: BedWardService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['mode'] || changes['floor']) {
      this.formData =
        this.mode === 'edit' && this.floor
          ? {
              floorNumber: this.floor.floorNumber,
              floorName: this.floor.floorName,
              description: this.floor.description,
              active: this.floor.active,
            }
          : { active: true };
    }
  }

  onSubmit(value: Partial<Floor>): void {
    if (this.loading) return;

    const request = {
      floorNumber: Number(value.floorNumber),
      floorName: value.floorName?.trim() ?? '',
      description: value.description?.trim() ?? '',
      active: value.active ?? true,
    };

    this.loading = true;

    const request$ =
      this.mode === 'edit' && this.floor
        ? this.bedWardService.updateFloor(this.floor.floorId, request)
        : this.bedWardService.createFloor(request);

    request$.subscribe({
      next: () => {
        this.loading = false;
        this.saved.emit();
      },
      error: (error: any) => {
        console.error('Failed to save floor', error);
        this.loading = false;
      },
    });
  }

  onCancel(): void {
    this.cancelled.emit();
  }
}
