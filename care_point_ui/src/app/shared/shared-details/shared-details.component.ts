import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';

export interface DetailField {
  field: string;
  label: string;
  type?: 'text' | 'number' | 'date' | 'status' | 'boolean';
  width?: string;
}

@Component({
  selector: 'app-shared-details',
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    TagModule
  ],
  templateUrl: './shared-details.component.html',
  styleUrl: './shared-details.component.css'
})
export class SharedDetailsComponent {

  @Input() visible = false;

  @Input() title = 'Details';

  @Input() data: any = null;

  @Input() fields: DetailField[] = [];

  @Output() visibleChange = new EventEmitter<boolean>();


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

    return field
      .split('.')
      .reduce(
        (value, key) => value?.[key],
        row
      );
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
    value: any
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

    return value === null ||
           value === undefined ||
           value === '';
  }

}