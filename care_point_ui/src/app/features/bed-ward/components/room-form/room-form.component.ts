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
import { Room } from '../../models/room.model';
import { Ward } from '../../models/ward.model';
import { BedWardService } from '../../services/bed-ward.service';
import { ROOM_FORM_CONFIG, ROOM_TYPES } from '../../config/room-form.config';


@Component({
  selector: 'app-room-form',
  standalone: true,
  imports: [CommonModule, DynamicFormComponent],
  templateUrl: './room-form.component.html',
})
export class RoomFormComponent implements OnChanges {
  @Input() mode: 'create' | 'edit' = 'create';
  @Input() room: Room | null = null;

  @Output() saved = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  formConfig = {
    ...ROOM_FORM_CONFIG,
    fields: ROOM_FORM_CONFIG.fields.map((field) => ({ ...field })),
  };

  formData: Partial<Room> = {};
  wards: Ward[] = [];
  loading = false;

  constructor(private readonly bedWardService: BedWardService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['mode'] || changes['room']) {
      this.formData =
        this.mode === 'edit' && this.room
          ? {
              wardId: this.room.wardId,
              roomNumber: this.room.roomNumber,
              roomType: this.room.roomType,
              status: this.room.status,
            }
          : { status: 'AVAILABLE' };
    }

    this.loadWards();
    this.setRoomTypeOptions();
  }

  private loadWards(): void {
    this.bedWardService.getAllWards().subscribe({
      next: (response: any) => {
        this.wards = response?.data?.content ?? response?.data ?? [];

        this.setFieldOptions(
          'wardId',
          this.wards.map((ward) => ({
            label: ward.wardName,
            value: ward.wardId,
          })),
        );
      },
      error: (error) => console.error('Failed to load wards', error),
    });
  }

  // private setRoomTypeOptions(): void {
  //   this.setFieldOptions(
  //     'roomType',
  //     ROOM_TYPES.map((type) => ({
  //       label: type.replace(/_/g, ' '),
  //       value: type,
  //     })),
  //   );
  // }
private setRoomTypeOptions(): void {
  this.setFieldOptions(
    'roomType',
    ROOM_TYPES.map((type) => ({
      label: type.label, // Directly use the pre-formatted label from the array
      value: type.value, // Directly use the value
    })),
  );
}
  private setFieldOptions(
    name: string,
    options: { label: string; value: any }[],
  ): void {
    this.formConfig = {
      ...this.formConfig,
      fields: this.formConfig.fields.map((field) =>
        field.name === name ? { ...field, options } : field,
      ),
    };
  }

  onSubmit(value: Partial<Room>): void {
    if (this.loading) return;

    const request = {
      wardId: Number(value.wardId),
      roomNumber: value.roomNumber?.trim() ?? '',
      roomType: value.roomType ?? '',
      status: value.status ?? 'AVAILABLE',
    };

    this.loading = true;

    const request$ =
      this.mode === 'edit' && this.room
        ? this.bedWardService.updateRoom(this.room.roomId, request)
        : this.bedWardService.createRoom(request);

    request$.subscribe({
      next: () => {
        this.loading = false;
        this.saved.emit();
      },
      error: (error) => {
        console.error('Failed to save room', error);
        this.loading = false;
      },
    });
  }

  onCancel(): void {
    this.cancelled.emit();
  }
}