import { Component, inject, signal } from '@angular/core';

import {
  SharedTableComponent,
  SharedTableConfig,
} from '../../../../shared/shared-table/shared-table.component';

import { SharedDetailsComponent } from '../../../../shared/shared-details/shared-details.component';

import { Router } from '@angular/router';

import { API_NAVIGATION } from '../../../../core/constants/api-endpoints';
import { MedicationService } from '../../services/medication.service';
import {
  MEDICATION_COLUMNS,
  MEDICATION_TABLE_CONFIG,
} from '../../configs/medication-table.config';
import { MedicationModel } from '../../models/medication.model';
import { MEDICATION_DETAILS_FIELD } from '../../configs/medication-form.config';
import { MedicationFormComponent } from '../../components/medication-form/medication-form.component';
import { CommonModule } from '@angular/common';
import { Dialog } from 'primeng/dialog';

@Component({
  selector: 'app-medication-list',

  standalone: true,

  imports: [
    SharedTableComponent,
    SharedDetailsComponent,
    MedicationFormComponent,
    CommonModule,
    Dialog,
  ],

  templateUrl: './medication-list.component.html',

  styleUrl: './medication-list.component.css',
})
export class MedicationListComponent {
  // ========================================================
  // DEPENDENCIES
  // ========================================================

  private readonly medicationService = inject(MedicationService);

  private readonly router = inject(Router);

  // ========================================================
  // TABLE CONFIGURATION
  // ========================================================

  medicationColumns = MEDICATION_COLUMNS;

  tableConfig: SharedTableConfig = MEDICATION_TABLE_CONFIG;

  // ========================================================
  // DATA
  // ========================================================

  medications = signal<MedicationModel[]>([]);

  filteredMedications = signal<MedicationModel[]>([]);

  totalRecords = signal(0);

  // ========================================================
  // PAGINATION
  // ========================================================

  currentPage = 0;

  currentPageSize = 10;

  // ========================================================
  // DETAILS
  // ========================================================

  viewDialogVisible = false;

  selectedMedication = signal<MedicationModel | null>(null);

  medicationDetailsFields = MEDICATION_DETAILS_FIELD;

  showForm = false;
  formMode: 'create' | 'edit' = 'create';

  // ========================================================
  // INITIAL LOAD
  // ========================================================

  constructor() {
    this.loadMedications();
  }

  // ========================================================
  // LOAD MEDICATIONS
  // ========================================================

  loadMedications(): void {
    this.medicationService
      .getAllMedications(this.currentPage, this.currentPageSize)
      .subscribe({
        next: (response: any) => {
          const content = response?.data || [];

          this.medications.set(content);

          this.filteredMedications.set(content);

          this.totalRecords.set(response?.data?.totalElements || 0);
        },

        error: (error: any) => {
          console.error('Failed to load medications:', error);

          this.medications.set([]);

          this.filteredMedications.set([]);

          this.totalRecords.set(0);
        },
      });
  }

  // ========================================================
  // PAGINATION
  // ========================================================

  onPageChange(event: { page: number; size: number; first: number }): void {
    this.currentPage = event.page;

    this.currentPageSize = event.size;

    this.loadMedications();
  }

  // ========================================================
  // REFRESH
  // ========================================================

  onRefresh(): void {
    this.loadMedications();
  }

  // ========================================================
  // SEARCH
  // ========================================================

  onSearch(searchValue: string): void {
    const value = searchValue?.trim().toLowerCase();

    if (!value) {
      this.filteredMedications.set(this.medications());

      return;
    }

    const filtered = this.medications().filter((medication) => {
      return (
        String(medication.name ?? '')
          .toLowerCase()
          .includes(value) ||
        String(medication.genericName ?? '')
          .toLowerCase()
          .includes(value) ||
        String(medication.strength ?? '')
          .toLowerCase()
          .includes(value)
      );
    });

    this.filteredMedications.set(filtered);
  }

  // ========================================================
  // VIEW
  // ========================================================

  viewMedication(medication: MedicationModel): void {
    this.selectedMedication.set(medication);

    this.viewDialogVisible = true;
  }

  // ========================================================
  // EDIT
  // ========================================================

  // editMedication(event: {
  //   medication?: MedicationModel;
  //   [key: string]: any;
  // }): void {
  //   /**
  //    * Depending on your SharedTable event
  //    * structure, this may be:
  //    *
  //    * event
  //    *
  //    * OR
  //    *
  //    * event.medication
  //    */

  //   const medication = event?.medication ?? event;

  //   // this.router.navigate([API_NAVIGATION.MEDICATIONS.CREATE], {
  //   //   state: {
  //   //     medication,
  //   //     mode: 'edit',
  //   //   },
  //   // });
  // }

  // ========================================================
  // DELETE
  // ========================================================

  deleteMedication(medication: MedicationModel): void {
    const medicationId = medication?.medicationId;

    if (medicationId === undefined) {
      console.error('Medication ID is undefined. Cannot delete medication.');

      return;
    }

    const medicationName = medication.name || 'this medication';

    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${medicationName}?`,
    );

    if (!confirmDelete) {
      return;
    }

    this.medicationService.deleteMedication(medicationId).subscribe({
      next: () => {
        this.loadMedications();
      },

      error: (error: any) => {
        console.error(
          `Failed to delete medication with ID ${medicationId}:`,
          error,
        );
      },
    });
  }

  // ========================================================
  // CREATE
  // ========================================================

  createNewMedication(): void {
    this.formMode = 'create';
    this.selectedMedication.set(null);
    this.showForm = true;
  }

  editMedication(event: MedicationModel): void {
    this.formMode = 'edit';
    this.selectedMedication.set(event); // Direct assignment
    this.showForm = true;
  }

  onMedicationSaved(): void {
    this.showForm = false;
    this.selectedMedication.set(null);
    this.loadMedications();
  }

  onFormCancelled(): void {
    this.showForm = false;
    this.selectedMedication.set(null);
  }
}
