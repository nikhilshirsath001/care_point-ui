import { CommonModule, DatePipe } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';

// PrimeNG
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TableModule } from 'primeng/table';

export type SearchType =
  | 'patient'
  | 'admission'
  | 'custom';

export type SearchColumnType =
  | 'text'
  | 'number'
  | 'date'
  | 'datetime'
  | 'status'
  | 'boolean';

export interface SearchColumn {
  field: string;
  header: string;
  width?: string;

  /**
   * Controls how the value is displayed.
   *
   * text      -> normal text
   * number    -> number
   * date      -> date only
   * datetime  -> date + time
   * status    -> normal status text
   * boolean   -> Yes / No
   */
  type?: SearchColumnType;

  /**
   * Optional Angular DatePipe format.
   *
   * Example:
   * dd/MM/yyyy
   * dd MMM yyyy
   * dd/MM/yyyy HH:mm
   */
  format?: string;
}

export interface PatientSearchConfig {
  /**
   * Type of entity being searched.
   *
   * Default = patient
   */
  searchType?: SearchType;

  title?: string;
  description?: string;
  placeholder?: string;

  searchButtonLabel?: string;
  selectButtonLabel?: string;

  /**
   * Singular entity name.
   *
   * Example:
   * Patient
   * Admission
   */
  entityLabel?: string;

  /**
   * Plural entity name.
   *
   * Example:
   * Patients
   * Admissions
   */
  entityLabelPlural?: string;

  /**
   * Unique identity field.
   *
   * patientId / admissionId / etc.
   */
  identityField?: string;

  /**
   * Primary display field.
   *
   * Used by generic/custom scenarios.
   */
  displayNameField?: string;

  /**
   * Columns displayed for multiple results.
   */
  resultColumns?: SearchColumn[];
}

@Component({
  selector: 'app-patient-search',
  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    RadioButtonModule,
    TableModule,
  ],

  providers: [
    DatePipe,
  ],

  templateUrl: './patient-search.component.html',
  styleUrl: './patient-search.component.css',
})
export class PatientSearchComponent {

  /**
   * Function provided by parent.
   *
   * Existing usage remains unchanged.
   */
  @Input() searchFn!: (
    keyword: string
  ) => Observable<any>;

  /**
   * Search configuration.
   *
   * Existing configurations continue to work.
   */
  @Input() config: PatientSearchConfig = {};

  /**
   * Existing output.
   *
   * DO NOT REMOVE.
   *
   * Existing patient-search screens depend on this.
   */
  @Output() patientSelected =
    new EventEmitter<any>();

  /**
   * New generic output.
   *
   * Use this for admission/custom searches.
   */
  @Output() itemSelected =
    new EventEmitter<any>();

  /**
   * Indicates whether an item has been confirmed.
   */
  isPatientSelected = false;

  patientSearchText = '';

  patientSuggestions: any[] = [];

  searchSelectedPatient: any | null = null;

  patientSearchLoading = false;

  hasSearched = false;

  constructor(
    private datePipe: DatePipe
  ) {}

  // ---------------------------------------------------------
  // Configuration helpers
  // ---------------------------------------------------------

  get searchType(): SearchType {
    return this.config?.searchType ?? 'patient';
  }

  get entityLabel(): string {
    return (
      this.config?.entityLabel ??
      (this.searchType === 'admission'
        ? 'Admission'
        : 'Patient')
    );
  }

  get entityLabelPlural(): string {
    return (
      this.config?.entityLabelPlural ??
      (this.searchType === 'admission'
        ? 'Admissions'
        : 'Patients')
    );
  }

  get identityField(): string {
    return (
      this.config?.identityField ??
      (this.searchType === 'admission'
        ? 'admissionId'
        : 'patientId')
    );
  }

  get isAdmissionSearch(): boolean {
    return this.searchType === 'admission';
  }

  get isPatientSearch(): boolean {
    return this.searchType === 'patient';
  }

  get isCustomSearch(): boolean {
    return this.searchType === 'custom';
  }

  // ---------------------------------------------------------
  // Search
  // ---------------------------------------------------------

  searchPatients(): void {

    const searchValue =
      this.patientSearchText.trim();

    if (!searchValue) {
      return;
    }

    if (!this.searchFn) {
      console.error(
        'PatientSearchComponent: searchFn is not provided.'
      );

      return;
    }

    this.isPatientSelected = false;

    this.patientSearchLoading = true;

    this.hasSearched = true;

    this.patientSuggestions = [];

    this.searchSelectedPatient = null;

    this.searchFn(searchValue).subscribe({

      next: (response: any) => {

        const data = response?.data;

        this.patientSuggestions =
          Array.isArray(data)
            ? data
            : data
              ? [data]
              : [];

        /**
         * Automatically select when
         * exactly one result exists.
         */
        if (
          this.patientSuggestions.length === 1
        ) {
          this.searchSelectedPatient =
            this.patientSuggestions[0];
        }

        this.patientSearchLoading = false;
      },

      error: (error: any) => {

        console.error(
          'Search failed',
          error
        );

        this.patientSuggestions = [];

        this.searchSelectedPatient = null;

        this.patientSearchLoading = false;
      },
    });
  }

  // ---------------------------------------------------------
  // Selection
  // ---------------------------------------------------------

  confirmPatientSelection(): void {

    if (!this.searchSelectedPatient) {
      return;
    }

    /**
     * Generic event.
     *
     * Works for:
     * Patient
     * Admission
     * Custom search
     */
    this.itemSelected.emit(
      this.searchSelectedPatient
    );

    /**
     * BACKWARD COMPATIBILITY
     *
     * Existing patient-search screens
     * continue receiving patientSelected.
     */
    if (this.searchType === 'patient') {

      this.patientSelected.emit(
        this.searchSelectedPatient
      );
    }

    this.isPatientSelected = true;
  }

  // ---------------------------------------------------------
  // Clear
  // ---------------------------------------------------------

  clearSearchInput(): void {

    this.patientSearchText = '';

    this.patientSuggestions = [];

    this.searchSelectedPatient = null;

    this.hasSearched = false;

    this.patientSearchLoading = false;

    this.isPatientSelected = false;
  }

  resetSearch(): void {

    this.patientSearchText = '';

    this.isPatientSelected = false;

    this.patientSuggestions = [];

    this.searchSelectedPatient = null;

    this.patientSearchLoading = false;

    this.hasSearched = false;
  }

  // ---------------------------------------------------------
  // Display helpers
  // ---------------------------------------------------------

  getPatientName(patient: any): string {

    if (!patient) {
      return '-';
    }

    /**
     * Admission response normally has
     * patientName directly.
     */
    if (patient.patientName) {
      return patient.patientName;
    }

    /**
     * Patient response normally has
     * firstName + lastName.
     */
    return [
      patient.firstName,
      patient.lastName,
    ]
      .filter(Boolean)
      .join(' ') || '-';
  }

  getDisplayName(item: any): string {

    if (!item) {
      return '-';
    }

    if (this.config?.displayNameField) {

      return (
        this.getNestedValue(
          item,
          this.config.displayNameField
        ) ?? '-'
      );
    }

    return this.getPatientName(item);
  }

  isSelected(item: any): boolean {

    const selectedId =
      this.getNestedValue(
        this.searchSelectedPatient,
        this.identityField
      );

    const itemId =
      this.getNestedValue(
        item,
        this.identityField
      );

    return (
      selectedId != null &&
      itemId != null &&
      selectedId === itemId
    );
  }

  getFieldValue(
    item: any,
    field: string
  ): any {

    return this.getNestedValue(
      item,
      field
    );
  }

  private getNestedValue(
    object: any,
    path: string
  ): any {

    if (!object || !path) {
      return null;
    }

    return path
      .split('.')
      .reduce(
        (value, key) =>
          value?.[key],
        object
      );
  }

  // ---------------------------------------------------------
  // Generic result columns
  // ---------------------------------------------------------

  get resultColumns(): SearchColumn[] {

    if (this.config?.resultColumns?.length) {
      return this.config.resultColumns;
    }

    /**
     * Default patient columns.
     *
     * Existing patient screens continue
     * to work even if type is not supplied.
     */
    if (this.searchType === 'patient') {

      return [
        {
          field: 'patientId',
          header: 'Patient ID',
          type: 'number',
        },

        {
          field: 'patientName',
          header: 'Patient Name',
          type: 'text',
        },

        {
          field: 'phone',
          header: 'Mobile',
          type: 'text',
        },

        {
          field: 'abhaId',
          header: 'ABHA ID',
          type: 'text',
        },

        {
          field: 'gender',
          header: 'Gender',
          type: 'text',
        },

        {
          field: 'dateOfBirth',
          header: 'Date Of Birth',
          type: 'date',
          format: 'dd/MM/yyyy',
        },
      ];
    }

    /**
     * Default admission columns.
     */
    if (this.searchType === 'admission') {

      return [
        {
          field: 'admissionId',
          header: 'Admission ID',
          type: 'number',
        },

        {
          field: 'patientId',
          header: 'Patient ID',
          type: 'number',
        },

        {
          field: 'patientName',
          header: 'Patient Name',
          type: 'text',
        },

        {
          field: 'admissionDate',
          header: 'Admission Date',
          type: 'datetime',
          format: 'dd/MM/yyyy HH:mm',
        },

        {
          field: 'wardName',
          header: 'Ward',
          type: 'text',
        },

        {
          field: 'bedNumber',
          header: 'Bed',
          type: 'text',
        },

        {
          field: 'status',
          header: 'Status',
          type: 'status',
        },
      ];
    }

    return [];
  }

  // ---------------------------------------------------------
  // Value formatter
  // ---------------------------------------------------------

  formatValue(
    item: any,
    column: SearchColumn
  ): string {

    const value =
      this.getFieldValue(
        item,
        column.field
      );

    if (
      value === null ||
      value === undefined ||
      value === ''
    ) {
      return '-';
    }

    switch (column.type) {

      case 'date':
        return (
          this.datePipe.transform(
            value,
            column.format || 'dd/MM/yyyy'
          ) || '-'
        );

      case 'datetime':
        return (
          this.datePipe.transform(
            value,
            column.format || 'dd/MM/yyyy HH:mm'
          ) || '-'
        );

      case 'number':
        return String(value);

      case 'boolean':
        return value ? 'Yes' : 'No';

      case 'status':
        return String(value);

      case 'text':
      default:
        return String(value);
    }
  }
}