import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';

// PrimeNG
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TableModule } from 'primeng/table';

export interface PatientSearchConfig {
  title?: string;
  description?: string;
  placeholder?: string;
  searchButtonLabel?: string;
  selectButtonLabel?: string;
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

  templateUrl: './patient-search.component.html',
  styleUrl: './patient-search.component.css',
})
export class PatientSearchComponent {
  /**
   * Function provided by parent to perform patient search.
   *
   * Example:
   * [searchFn]="searchPatientFn"
   */
  @Input() searchFn!: (keyword: string) => Observable<any>;

  /**
   * Optional configuration.
   */
  @Input() config: PatientSearchConfig = {};

  /**
   * Emits the selected patient.
   */
  @Output() patientSelected = new EventEmitter<any>();

  isPatientSelected = false;

  patientSearchText = '';

  patientSuggestions: any[] = [];

  searchSelectedPatient: any | null = null;

  patientSearchLoading = false;

  /**
   * Indicates that the user has actually
   * performed a search.
   */
  hasSearched = false;

  clearSearchInput(): void {
    this.patientSearchText = '';

    // Clear previous search results
    this.patientSuggestions = [];

    // Clear selected patient from search results
    this.searchSelectedPatient = null;

    // Reset search state
    this.hasSearched = false;

    // Stop loading state if required
    this.patientSearchLoading = false;
  }

  /**
   * Search patients using the function
   * supplied by the parent component.
   */
  searchPatients(): void {
    const searchValue = this.patientSearchText.trim();

    if (!searchValue) {
      return;
    }

    if (!this.searchFn) {
      console.error('PatientSearchComponent: searchFn is not provided.');
      return;
    }
    this.isPatientSelected=false;
    this.patientSearchLoading = true;

    this.hasSearched = true;

    this.patientSuggestions = [];

    this.searchSelectedPatient = null;

    this.searchFn(searchValue).subscribe({
      next: (response: any) => {
        const data = response?.data;

        this.patientSuggestions = Array.isArray(data)
          ? data
          : data
            ? [data]
            : [];

        /**
         * Automatically select patient
         * when exactly one result is found.
         */
        if (this.patientSuggestions.length === 1) {
          this.searchSelectedPatient = this.patientSuggestions[0];
        }

        this.patientSearchLoading = false;
      },

      error: (error: any) => {
        console.error('Patient search failed', error);

        this.patientSuggestions = [];

        this.searchSelectedPatient = null;

        this.patientSearchLoading = false;
      },
    });
  }

  /**
   * Select patient and notify parent.
   */
  confirmPatientSelection(): void {
    console.log('Before emit:', this.isPatientSelected);

    if (!this.searchSelectedPatient) {
      return;
    }
    console.log('Before emit:', this.isPatientSelected);

    this.patientSelected.emit(this.searchSelectedPatient);

    this.isPatientSelected = true;

    console.log('After emit:', this.isPatientSelected);
  }


  /**
   * Reset search state.
   */
  resetSearch(): void {
    this.patientSearchText = '';
    this.isPatientSelected=false;

    this.patientSuggestions = [];

    this.searchSelectedPatient = null;

    this.patientSearchLoading = false;

    this.hasSearched = false;
  }

  /**
   * Returns patient display name.
   */
  getPatientName(patient: any): string {
    return [patient?.firstName, patient?.lastName].filter(Boolean).join(' ');
  }

  /**
   * Returns true when selected patient
   * matches the current row.
   */
  isSelected(patient: any): boolean {
    return this.searchSelectedPatient?.patientId === patient?.patientId;
  }
}
