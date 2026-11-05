
import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';

import { finalize } from 'rxjs';

import { DynamicFormComponent } from '../../../../shared/dynamic-form/dynamic-form.component';
import { Bed } from '../../models/bed.model';
import { DynamicFormConfig } from '../../../../core/models/dynamic-form.model';
import { BED_FORM_CONFIG } from '../../config/bed-form.config';
import { BedWardService } from '../../services/bed-ward.service';

@Component({
  selector: 'app-bed-form',
  standalone: true,
  imports: [CommonModule, DynamicFormComponent],
  templateUrl: './bed-form.component.html',
  styleUrl: './bed-form.component.css',
})
export class BedFormComponent implements OnChanges {

  @Input() mode: 'create' | 'edit' = 'create';
  @Input() bed: Bed | null = null;

  @Output() saved = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  loading = false;

  private selectedWardId: number | null = null;
  private roomRequestId = 0;

  formConfig: DynamicFormConfig = {
    ...BED_FORM_CONFIG,
    fields: BED_FORM_CONFIG.fields.map(field => ({
      ...field,
      options: field.options ? [...field.options] : undefined,
    })),
  };

  constructor(private bedWardService: BedWardService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['mode'] || changes['bed']) {
      this.prepareForm();
    }
  }

  private prepareForm(): void {
    this.selectedWardId = null;
    this.roomRequestId++;

    this.resetFormOptions();
    this.loadWardOptions();
  }

  private resetFormOptions(): void {
    const wardField = this.getField('wardId');
    const roomField = this.getField('roomId');

    if (wardField) wardField.options = [];
    if (roomField) roomField.options = [];
  }

  private getField(name: string) {
    return this.formConfig.fields.find(field => field.name === name);
  }

  private loadWardOptions(): void {
    this.bedWardService.getAllWards().subscribe({
      next: (response: any) => {

        const wards = response?.data ?? [];
        const wardField = this.getField('wardId');

        if (!wardField) {
          console.error('Ward field not found');
          return;
        }

        wardField.options = wards
          .filter((ward: any) => ward.active)
          .map((ward: any) => ({
            label: ward.wardName,
            value: Number(ward.wardId),
          }));

        if (this.mode === 'edit' && this.bed?.wardId) {
          this.selectedWardId = Number(this.bed.wardId);

          this.loadRoomOptions(this.selectedWardId);
        }
      },
      error: error => {
        console.error('Failed to load wards', error);
      },
    });
  }

  onFieldChange(formData: Record<string, any>): void {

    const wardId = Number(formData['wardId']);

    if (!wardId || wardId === this.selectedWardId) {
      return;
    }

    this.selectedWardId = wardId;

    const roomField = this.getField('roomId');

    if (roomField) {
      roomField.options = [];
    }

    this.loadRoomOptions(wardId);
  }

  private loadRoomOptions(wardId: number): void {

    const requestId = ++this.roomRequestId;
    const roomField = this.getField('roomId');

    if (roomField) {
      roomField.options = [];
    }

    this.bedWardService.getRoomBaseOnWardId(wardId).subscribe({
      next: (response: any) => {

        if (requestId !== this.roomRequestId) return;

        const rooms = response?.data ?? [];

        if (roomField) {
          roomField.options = rooms.map((room: any) => ({
            label: room.roomNumber,
            value: Number(room.roomId),
          }));
        }
      },
      error: error => {
        if (requestId === this.roomRequestId) {
          console.error('Failed to load rooms', error);
        }
      },
    });
  }

  onSubmit(formData: Record<string, any>): void {

    if (this.loading) return;

    const payload = {
      roomId: Number(formData['roomId']),
      bedNumber: String(formData['bedNumber'] ?? '').trim(),
      status: formData['status'],
    };

    if (!payload.roomId || !payload.bedNumber || !payload.status) {
      console.error('Please fill all required fields.');
      return;
    }

    this.loading = true;

    if (this.mode === 'create') {
      this.createBed(payload);
    } else {
      this.updateBed(payload);
    }
  }

  private createBed(payload: {
    roomId: number;
    bedNumber: string;
    status: string;
  }): void {

    this.bedWardService
      .createBed(payload)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: () => {
          console.log('Bed created successfully');
          this.saved.emit();
        },
        error: error => {
          console.error('Failed to create bed:', error);
        },
      });
  }

  private updateBed(payload: {
    roomId: number;
    bedNumber: string;
    status: string;
  }): void {

    const bedId =
      (this.bed as any)?.bedId ??
      (this.bed as any)?.id;

    if (bedId == null) {
      this.loading = false;
      console.error('Cannot update bed: Bed ID is missing.', this.bed);
      return;
    }

    this.bedWardService
      .updateBed(bedId, payload)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: () => {
          console.log('Bed updated successfully');
          this.saved.emit();
        },
        error: error => {
          console.error('Failed to update bed:', error);
        },
      });
  }

  onCancel(): void {
    this.cancelled.emit();
  }
}
