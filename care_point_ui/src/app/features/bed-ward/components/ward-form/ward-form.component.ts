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
import { Ward } from '../../models/ward.model';
import { Floor } from '../../models/floor.model';
import { BedWardService } from '../../services/bed-ward.service';
import { WARD_FORM_CONFIG, WARD_TYPES } from '../../config/ward-form.config';
import { AdministratorService } from '../../../administrator/services/administrator.service';

@Component({
  selector: 'app-ward-form',
  standalone: true,
  imports: [CommonModule, DynamicFormComponent],
  templateUrl: './ward-form.component.html',
})
export class WardFormComponent implements OnChanges {
  @Input() mode: 'create' | 'edit' = 'create';
  @Input() ward: Ward | null = null;

  @Output() saved = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  formConfig = {
    ...WARD_FORM_CONFIG,
    fields: WARD_FORM_CONFIG.fields.map((field) => ({ ...field })),
  };

  formData: Partial<Ward> = {};
  floors: Floor[] = [];
  departments: any[] = [];
  loading = false;
  wardTypes = WARD_TYPES;

  constructor(
    private readonly bedWardService: BedWardService,
    private readonly administratorService: AdministratorService,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['mode'] || changes['ward']) {
      this.formData =
        this.mode === 'edit' && this.ward
          ? {
              departmentId: this.ward.departmentId,
              floorId: this.ward.floorId,
              wardName: this.ward.wardName,
              wardType: this.ward.wardType,
              active: this.ward.active,
            }
          : { active: true };
    }

    this.loadFloors();
    this.setWardTypeOptions();
    this.loadDepartments();
  }

  private loadFloors(): void {
    this.bedWardService.getAllFloors().subscribe({
      next: (response: any) => {
        this.floors = response?.data?.content ?? response?.data ?? [];

        this.setFieldOptions(
          'floorId',
          this.floors.map((floor) => ({
            label: `${floor.floorName} (Floor ${floor.floorNumber})`,
            value: floor.floorId,
          })),
        );
      },
      error: (error) => console.error('Failed to load floors', error),
    });
  }

  private loadDepartments(): void {
    this.administratorService.getAllDepartments().subscribe({
      next: (response: any) => {
        this.departments = response?.data?.content ?? response?.data ?? [];

        this.setFieldOptions(
          'departmentId',
          this.departments.map((deparment) => ({
            label: `${deparment.departmentName}`,
            value: deparment.departmentId,
          })),
        );
      },
      error: (error) => console.error('Failed to load departments', error),
    });
  }

  private setWardTypeOptions(): void {
    this.setFieldOptions(
      'wardType',
      WARD_TYPES.map((type) => ({
        label: type.label,
        value: type.value,
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

  onSubmit(value: Partial<Ward>): void {
    if (this.loading) return;

    const request = {
      departmentId: Number(value.departmentId),
      floorId: Number(value.floorId),
      wardName: value.wardName?.trim() ?? '',
      wardType: value.wardType ?? '',
      active: value.active ?? true,
    };

    this.loading = true;

    const request$ =
      this.mode === 'edit' && this.ward
        ? this.bedWardService.updateWard(this.ward.wardId, request)
        : this.bedWardService.createWard(request);

    request$.subscribe({
      next: () => {
        this.loading = false;
        this.saved.emit();
      },
      error: (error) => {
        console.error('Failed to save ward', error);
        this.loading = false;
      },
    });
  }

  onCancel(): void {
    this.cancelled.emit();
  }
}
