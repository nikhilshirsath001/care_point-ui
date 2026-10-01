import { Component } from '@angular/core';
import { ServiceFormComponent } from '../../../components/service/service-form/service-form.component';
import { ServiceCategoryFormComponent } from '../../../components/service/service-category-form/service-category-form.component';
import { Dialog } from 'primeng/dialog';
import { SharedTableComponent, SharedTableConfig, TableColumn } from '../../../../../shared/shared-table/shared-table.component';
import { TabView, TabViewModule } from 'primeng/tabview';
import { AdministratorService } from '../../../services/administrator.service';
import { SERVICE_CATEGORY_COLUMNS } from '../../../config/service-category-table.config';
import { TABLE_CONFIG } from '../../../config/department-table.config';
import { SERVICE_COLUMNS } from '../../../config/service-table.config';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-service',
  imports: [ServiceFormComponent, ServiceCategoryFormComponent, Dialog, SharedTableComponent, TabViewModule, TabView,ButtonModule],
  templateUrl: './service.component.html',
  styleUrl: './service.component.css'
})
export class ServiceComponent {

  // =========================================================
// SERVICE TABLE
// =========================================================

serviceColumns: TableColumn[] = SERVICE_COLUMNS;
serviceTableConfig: SharedTableConfig = TABLE_CONFIG;
services: any[] = [];


// =========================================================
// SERVICE CATEGORY TABLE
// =========================================================

serviceCategoryColumns: TableColumn[] = SERVICE_CATEGORY_COLUMNS;
serviceCategoryTableConfig: SharedTableConfig =TABLE_CONFIG;

serviceCategories: any[] = [];


// =========================================================
// FORM STATE
// =========================================================

showServiceForm = false;
showServiceCategoryForm = false;

serviceFormMode: 'create' | 'edit' = 'create';
serviceCategoryFormMode: 'create' | 'edit' = 'create';

selectedService: any | null = null;
selectedServiceCategory: any | null = null;


// =========================================================
// CONSTRUCTOR
// =========================================================

constructor(
  private administratorService: AdministratorService
) {}


// =========================================================
// INIT
// =========================================================

ngOnInit(): void {
  this.loadServices();
  this.loadServiceCategories();
}


// =========================================================
// LOAD SERVICES
// =========================================================

loadServices(): void {

  this.administratorService.getAllServices().subscribe({
    next: (response) => {
      this.services = response?.data ?? [];
    },
    error: (error) => {
      console.error('Failed to load services', error);
    }
  });

}


// =========================================================
// LOAD SERVICE CATEGORIES
// =========================================================

loadServiceCategories(): void {

  this.administratorService.getAllServiceCategories().subscribe({
    next: (response:any) => {
      this.serviceCategories = response?.data ?? [];
    },
    error: (error:any) => {
      console.error(
        'Failed to load service categories',
        error
      );
    }
  });

}


// =========================================================
// CREATE SERVICE
// =========================================================

openCreateServiceForm(): void {

  this.serviceFormMode = 'create';
  this.selectedService = null;
  this.showServiceForm = true;

}


// =========================================================
// EDIT SERVICE
// =========================================================

openEditServiceForm(service: any): void {

  this.serviceFormMode = 'edit';
  this.selectedService = { ...service };
  this.showServiceForm = true;

}


// =========================================================
// SERVICE SAVED
// =========================================================

onServiceSaved(): void {

  this.showServiceForm = false;
  this.selectedService = null;

  this.loadServices();

}


// =========================================================
// SERVICE CANCELLED
// =========================================================

onServiceFormCancelled(): void {

  this.showServiceForm = false;
  this.selectedService = null;

}


// =========================================================
// CREATE SERVICE CATEGORY
// =========================================================

openCreateServiceCategoryForm(): void {

  this.serviceCategoryFormMode = 'create';
  this.selectedServiceCategory = null;
  this.showServiceCategoryForm = true;

}


// =========================================================
// EDIT SERVICE CATEGORY
// =========================================================

openEditServiceCategoryForm(
  serviceCategory: any
): void {

  this.serviceCategoryFormMode = 'edit';
  this.selectedServiceCategory = {
    ...serviceCategory
  };

  this.showServiceCategoryForm = true;

}


// =========================================================
// SERVICE CATEGORY SAVED
// =========================================================

onServiceCategorySaved(): void {

  this.showServiceCategoryForm = false;
  this.selectedServiceCategory = null;

  this.loadServiceCategories();

}


// =========================================================
// SERVICE CATEGORY CANCELLED
// =========================================================

onServiceCategoryFormCancelled(): void {

  this.showServiceCategoryForm = false;
  this.selectedServiceCategory = null;

}
}
