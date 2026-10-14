import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { BedWardService } from '../../services/bed-ward.service';
import { Bed } from '../../models/bed.model';
import { SharedTableComponent, SharedTableConfig, TableColumn } from '../../../../shared/shared-table/shared-table.component';
import { BED_COLUMNS, TABLE_CONFIG } from '../../config/bed-table.config';
import { BedFormComponent } from '../../components/bed-form/bed-form.component';

@Component({
  selector: 'app-beds',
  imports: [
    CommonModule,
    ButtonModule,
    DialogModule,

    SharedTableComponent,
    BedFormComponent
],
  templateUrl: './beds.component.html',
  styleUrl: './beds.component.css'
})
export class BedsComponent  implements OnInit {


  // =========================================================
  // TABLE
  // =========================================================

  bedColumns: TableColumn[] = BED_COLUMNS;

  tableConfig: SharedTableConfig = TABLE_CONFIG;


  // =========================================================
  // DATA
  // =========================================================

  beds: Bed[] = [];

  loading = false;


  // =========================================================
  // FORM
  // =========================================================

  showForm = false;

  formMode: 'create' | 'edit' = 'create';

  selectedBed: Bed | null = null;


  constructor(
    private bedWardService: BedWardService
  ) {}


  // =========================================================
  // INIT
  // =========================================================

  ngOnInit(): void {

    this.loadBeds();

  }


  // =========================================================
  // LOAD BEDS
  // =========================================================

  loadBeds(): void {

    this.loading = true;

    // this.bedWardService
    //   .getBeds()
    //   .subscribe({

    //     next: (response) => {

    //       this.beds =
    //         response?.data ?? [];

    //       this.loading = false;

    //     },

    //     error: (error) => {

    //       console.error(
    //         'Failed to load beds',
    //         error
    //       );

    //       this.loading = false;

    //     }

    //   });

  }


  // =========================================================
  // CREATE
  // =========================================================

  openCreateForm(): void {

    this.formMode = 'create';

    this.selectedBed = null;

    this.showForm = true;

  }


  // =========================================================
  // EDIT
  // =========================================================

  openEditForm(
    bed: Bed
  ): void {

    this.formMode = 'edit';

    this.selectedBed = {
      ...bed
    };

    this.showForm = true;

  }


  // =========================================================
  // FORM SAVED
  // =========================================================

  onBedSaved(): void {

    this.showForm = false;

    this.selectedBed = null;

    this.loadBeds();

  }


  // =========================================================
  // FORM CANCELLED
  // =========================================================

  onFormCancelled(): void {

    this.showForm = false;

    this.selectedBed = null;

  }

}