import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import * as XLSX from 'xlsx';

export interface TableColumn {
  field: string;
  header: string;
  sortable?: boolean;
  width?: string;
  type?: 'text' | 'number' | 'date' | 'status' | 'action';
  exportable?: boolean;
}


export interface SharedTableConfig {
  searchable?: boolean;
  paginator?: boolean;
  rows?: number;
  rowsPerPageOptions?: number[];
  exportable?: boolean;
  showRefresh?: boolean;
  loading?: boolean;
  emptyMessage?: string;
}

@Component({
  selector: 'app-shared-table',
  imports: [
    TableModule,
    CommonModule,
    ButtonModule,
    InputTextModule,
    TagModule
  ],
  templateUrl: './shared-table.component.html',
  styleUrl: './shared-table.component.css'
})
export class SharedTableComponent {
  @Input() columns: TableColumn[] = [];

  @Input() data: any[] = [];

  @Input() title = 'Records';

  @Input() subtitle = '';

  @Input() config: SharedTableConfig = {
    searchable: true,
    paginator: true,
    rows: 10,
    rowsPerPageOptions: [10, 25, 50],
    exportable: true,
    showRefresh: true,
    loading: false,
    emptyMessage: 'No records found'
  };

  @Output() refresh = new EventEmitter<void>();

  @Output() view = new EventEmitter<any>();

  @Output() edit = new EventEmitter<any>();

  @Output() delete = new EventEmitter<any>();


  onRefresh(): void {
    this.refresh.emit();
  }


  onView(row: any): void {
    this.view.emit(row);
  }


  onEdit(row: any): void {
    this.edit.emit(row);
  }


  onDelete(row: any): void {
    this.delete.emit(row);
  }


  getStatusSeverity(
    status: string
  ): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {

    switch (status?.toLowerCase()) {

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

onDownloadExcel(): void {

  if (!this.data || this.data.length === 0) {
    return;
  }

  // Exclude action columns from Excel
  const exportColumns = this.columns.filter(
    column => column.type !== 'action'
  );

  // Create Excel rows dynamically
  const exportData = this.data.map(row => {

    const excelRow: any = {};

    exportColumns.forEach(column => {

      let value = row[column.field];

      // Format values based on column type
      if (column.type === 'date' && value) {
        value = new Date(value).toLocaleDateString();
      }

      if (column.type === 'status' && value) {
        value = String(value);
      }

      excelRow[column.header] = value ?? '';

    });

    return excelRow;
  });

  // Convert JSON data to worksheet
  const worksheet: XLSX.WorkSheet =
    XLSX.utils.json_to_sheet(exportData);

  // Create workbook
  const workbook: XLSX.WorkBook =
    XLSX.utils.book_new();

  // Add worksheet
  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    'Records'
  );

  // Generate filename
  const fileName =
    `${this.title.replace(/\s+/g, '_')}_${this.getCurrentDate()}.xlsx`;

  // Download Excel
  XLSX.writeFile(workbook, fileName);
}

private getCurrentDate(): string {
  const date = new Date();

  return date
    .toISOString()
    .split('T')[0];
}
}