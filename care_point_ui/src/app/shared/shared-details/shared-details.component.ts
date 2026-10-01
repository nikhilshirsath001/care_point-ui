import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  signal,
  SimpleChanges,
} from '@angular/core';

import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';

export interface DetailField {
  field: string;
  label: string;
  type?: 'text' | 'number' | 'date' | 'status' | 'boolean';
  width?: string;
  isGroup?: boolean;
  level?: number;
}

@Component({
  selector: 'app-shared-details',
  standalone: true,
  imports: [CommonModule, DialogModule, TagModule],
  templateUrl: './shared-details.component.html',
  styleUrl: './shared-details.component.css',
})
export class SharedDetailsComponent {
  @Input() visible = false;

  @Input() title = 'Details';

  @Input() data: any = null;

  @Input() fields: DetailField[] = [];

  @Output() visibleChange = new EventEmitter<boolean>();

  fieldsNew = signal<DetailField[]>([]);

  /**
   * Get nested object value.
   *
   * Example:
   * department.departmentName
   */
  getFieldValue(row: any, field: string): any {
    if (!row || !field) {
      return null;
    }

    return field.split('.').reduce((value, key) => value?.[key], row);
  }

  /**
   * Close dialog
   */
  close(): void {
    this.visible = false;

    this.visibleChange.emit(false);
  }

  /**
   * Get status text
   */
  getStatusValue(value: any): string {
    if (typeof value === 'boolean') {
      return value ? 'Active' : 'Inactive';
    }

    if (value === null || value === undefined || value === '') {
      return '-';
    }

    return String(value);
  }

  /**
   * Get status severity
   */
  getStatusSeverity(
    value: any,
  ): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
    if (typeof value === 'boolean') {
      return value ? 'success' : 'danger';
    }

    switch (String(value)?.toLowerCase()) {
      case 'active':
      case 'approved':
      case 'completed':
      case 'success':
        return 'success';

      case 'pending':
      case 'processing':
        return 'warn';

      case 'inactive':
      case 'cancelled':
      case 'rejected':
      case 'failed':
        return 'danger';

      case 'new':
        return 'info';

      default:
        return 'secondary';
    }
  }

  /**
   * Check whether value is empty
   */
  isEmpty(value: any): boolean {
    return value === null || value === undefined || value === '';
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']?.currentValue) {
      this.generatedFields = this.getFields();
    }
  }

  getFields(): DetailField[] {
    if (this.fields?.length > 0) {
      return this.fields;
    }
    if (!this.data) {
      return [];
    }
    return this.buildFields(this.data);
    // return Object.keys(this.data).map(field => ({
    //   field,
    //   label: this.getLabel(field),
    //   type: this.getFieldType(this.data[field])
    // }));
  }

  getFieldType(value: any): DetailField['type'] {
    if (typeof value === 'boolean') {
      return 'boolean';
    }

    if (typeof value === 'number') {
      return 'number';
    }

    if (value instanceof Date) {
      return 'date';
    }

    return 'text';
  }

  getLabel(field: string): string {
    return field
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (char) => char.toUpperCase());
  }

  generatedFields: DetailField[] = [];

  buildFields(
    data: any,
    parentPath: string = '',
    level: number = 0,
  ): DetailField[] {
    const fields: DetailField[] = [];

    Object.keys(data).forEach((key) => {
      const value = data[key];

      const fieldPath = parentPath ? `${parentPath}.${key}` : key;

      const isObject =
        value !== null &&
        typeof value === 'object' &&
        !Array.isArray(value) &&
        !(value instanceof Date);

      if (isObject) {
        // Section
        fields.push({
          field: fieldPath,
          label: this.getLabel(key),
          isGroup: true,
          level,
        });

        // Children
        fields.push(...this.buildFields(value, fieldPath, level + 1));
      } else {
        fields.push({
          field: fieldPath,
          label: this.getLabel(key),
          type: this.getFieldType(value),
          level,
        });
      }
    });

    return fields;
  }
}
