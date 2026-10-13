import { Component, inject, OnInit } from '@angular/core';
import {
  SharedTableComponent,
  SharedTableConfig,
  TableColumn,
} from '../../../../shared/shared-table/shared-table.component';
import { StaffService } from '../../services/staff.service';
import { STAFF_COLUMNS, TABLE_CONFIG } from '../../config/staff-table.config';
import { StaffFormComponent } from '../../components/staff-form/staff-form.component';
import { Dialog } from 'primeng/dialog';
import { Staff } from '../../models/staff.model';
import { ButtonModule } from 'primeng/button';
import { SharedDetailsComponent } from '../../../../shared/shared-details/shared-details.component';
import { STAFF_DETAIL_FIELDS } from '../../config/staff-form.config';
import { API_NAVIGATION } from '../../../../core/constants/api-endpoints';
import { Router } from '@angular/router';

@Component({
  selector: 'app-staff-list',
  imports: [SharedTableComponent, StaffFormComponent, Dialog, ButtonModule, SharedDetailsComponent],
  templateUrl: './staff-list.component.html',
  styleUrl: './staff-list.component.css',
})
export class StaffListComponent implements OnInit {

  patientColumns: TableColumn[] = STAFF_COLUMNS;
  tableConfig: SharedTableConfig = TABLE_CONFIG;
  staffDetailFields=STAFF_DETAIL_FIELDS;
  staffList: any[] = [];
  loading = false;
  selectedStaff: any = null;
  viewDialogVisible = false;

  private readonly router = inject(Router);

  currentPage = 0;
  currentPageSize = 20;

  ngOnInit(): void {
    this.getAllStaff();
  }

  constructor(private staffService: StaffService) {}

  getAllStaff() {
    this.staffService.getAllStaff().subscribe({
      next: (res: any) => {
        this.staffList = res?.data?.content ??[];
      },
      error: (error: any) => {},
    });
  }

  onViewTable(staff: any): void {
    this.selectedStaff = staff;
    this.viewDialogVisible = true;
  }


  showForm = false;

  formMode: 'create' | 'edit' = 'create';



  onCreateTable(): void {
    this.formMode = 'create';

    this.selectedStaff = null;

    this.showForm = true;
  }



  openEditForm(bed: Staff): void {
    this.formMode = 'edit';

    this.selectedStaff = {
      ...bed,
    };

    this.showForm = true;
  }


  onStaffSaved(): void {
    this.showForm = false;

    this.selectedStaff = null;

    this.getAllStaff();
  }



  onFormCancelled(): void {
    this.showForm = false;

    this.selectedStaff = null;
  }

  OnEditTable(event: { patient: any }): void {
    this.router.navigate([API_NAVIGATION.PATIENTS.CREATE], {
      state: {
        patient: event,
        mode: 'edit'
      }
    });
  }

    onPageChangeTable(event: { page: number; size: number; first: number }): void {
    this.currentPage = event.page;
    this.currentPageSize = event.size;
    this.getAllStaff();
  }

    onRefreshTable() {
    this.getAllStaff();
  }

  onDeleteTable(record: any ) {
      const recordId = record.staffId;
      if (recordId === undefined) {
        console.error('Patient ID is undefined. Cannot delete.');
        return;
      }
      const confirmDelete = window.confirm(`Are you sure you want to delete ${record.firstName} ${record.lastName}?`);
      if (confirmDelete) {
        // this.staffService.deletePatient(patientId).subscribe({
        //   next: () => {
        //     this.getAllStaff();
        //   },
        //   error: (error) => {
        //     console.error(`Failed to delete patient with ID ${patientId}:`, error);
        //   }
        // });
      }
    }

    onSearchTable(searchValue: string) {
    if (searchValue.trim() !== '') {
      
      // this.currentPageSize = 100;
      // this.patientService.searchPatientByKeyword(searchValue, this.currentPage).subscribe((response) => {
        
      //   console.log('Search response:', response);
      //   this.filteredPatients.set(response.data?.data || []);
      // });

      // this.filteredPatients.set(this.patients().filter((patient) => {
      //   const lowerSearchValue = searchValue.toLowerCase();
      //   return (
      //     patient.firstName.toLowerCase().includes(lowerSearchValue) ||
      //     patient.lastName.toLowerCase().includes(lowerSearchValue) ||
      //     // patient.email.toLowerCase().includes(lowerSearchValue) ||
      //     patient.phone.toLowerCase().includes(lowerSearchValue) ||
      //     patient.abhaId.toLowerCase().includes(lowerSearchValue)
      //   );
      // }));
    }
    if (searchValue.trim() === '') {
      // this.filteredPatients.set(this.staffList());
    }
  }
}
