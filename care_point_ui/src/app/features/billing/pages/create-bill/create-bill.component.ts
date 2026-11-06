import { Component, OnInit, inject } from '@angular/core';
import { PatientService } from '../../../patient/services/patient-service.service';
import { IpdService } from '../../../ipd/services/ipd.service';
import {
  PatientSearchComponent,
  PatientSearchConfig,
} from '../../../../shared/patient-search/patient-search.component';
import {
  SharedTableComponent,
  TableColumn,
} from '../../../../shared/shared-table/shared-table.component';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BillingService } from '../../services/billing.service';
import { ServiceModel } from '../../models/service-model';
import { CreateBillRequest } from '../../models/createbill-request';

@Component({
  selector: 'app-create-bill',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PatientSearchComponent,
    SharedTableComponent,
  ],
  templateUrl: './create-bill.component.html',
  styleUrl: './create-bill.component.css',
})
export class CreateBillComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly billingService = inject(BillingService);
  private readonly patientService = inject(PatientService);
  private readonly ipdService = inject(IpdService);

  services: ServiceModel[] = [];

  billForm = this.fb.group({
    patientId: [null as number | null, Validators.required],
    visitId: [null as number | null],
    admissionId: [null as number | null],
    discount: [0, Validators.min(0)],
    tax: [0, Validators.min(0)],
    items: this.fb.array([]),
  });

  admissions: any[] = [];
  loadingAdmissions = false;
  selectedPatient: any | null = null;

  readonly patientSearchConfig: PatientSearchConfig = {
    title: 'Find Patient',
    description:
      'Search for an existing patient using Patient ABHA ID, name or mobile number.',
    placeholder: 'Enter Patient ABHA ID, name or mobile number',
    searchButtonLabel: 'Search Patient',
    selectButtonLabel: 'Select Patient',
  };

  readonly searchPatientFn = (keyword: string) =>
    this.patientService.searchPatientByKeyword(keyword);

  // ---------- Shared table for added services ----------
  readonly itemColumns: TableColumn[] = [
    { field: 'serviceName', header: 'Service' },
    { field: 'price', header: 'Price', type: 'number' },
    { field: 'quantity', header: 'Quantity', type: 'number' },
    { field: 'amount', header: 'Amount', type: 'number' },
    { field: 'actions', header: 'Actions', type: 'action' },
  ];

  readonly itemTableConfig: any = {
    searchable: false,
    paginator: false,
    exportable: false,
    showRefresh: false,
    loading: false,
    canView: false,
    canEdit: false,
    emptyMessage: 'No services added yet',
  };

  get items(): FormArray {
    return this.billForm.get('items') as FormArray;
  }

  get itemRows(): any[] {
    return this.items.controls
      .map((control, index) => {
        const value = control.value;
        const service: any = this.services.find(
          (s: any) => s.serviceId === value.serviceId,
        );
        const price = Number(service?.defaultPrice ?? 0);
        const quantity = Number(value.quantity ?? 0);

        return {
          index,
          serviceName: service?.serviceName ?? '',
          price,
          quantity,
          amount: price * quantity,
        };
      })
      .filter((row) => row.serviceName);
  }

  get subtotal(): number {
    return this.itemRows.reduce((sum, row) => sum + row.amount, 0);
  }

  ngOnInit(): void {
    this.loadServices();
    this.addItem();
  }

  loadServices(): void {
    this.billingService.getAllServices().subscribe({
      next: (response) => {
        this.services = response.data ?? [];
      },
      error: (error) => {
        console.error('Error loading services:', error);
      },
    });
  }

  loadAdmissions(patientId: number): void {
    this.loadingAdmissions = true;
    this.admissions = [];

    this.ipdService.getAdmissionsByPatientId(patientId).subscribe({
      next: (response: any) => {
        const data = response?.data;

        this.admissions = Array.isArray(data) ? data : (data?.content ?? []);

        this.loadingAdmissions = false;
      },
      error: (error: any) => {
        console.error('Failed to load patient admissions:', error);
        this.admissions = [];
        this.loadingAdmissions = false;
      },
    });
  }

  onPatientSelected(patient: any): void {
    if (!patient?.patientId) {
      return;
    }

    this.selectedPatient = patient;

    this.billForm.patchValue({
      patientId: patient.patientId,
      admissionId: null,
    });

    this.loadAdmissions(patient.patientId);
  }

  changePatient(): void {
    this.selectedPatient = null;
    this.admissions = [];

    this.billForm.patchValue({
      patientId: null,
      admissionId: null,
    });
  }

  createItem(): FormGroup {
    return this.fb.group({
      serviceId: [null, Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
    });
  }

  addItem(): void {
    this.items.push(this.createItem());
  }

  removeItem(index: number): void {
    if (this.items.length > 1) {
      this.items.removeAt(index);
    }
  }

  addService(serviceIdRaw: string, quantityRaw: string): void {
    const serviceId = Number(serviceIdRaw);
    const quantity = Number(quantityRaw);

    if (!serviceId || !quantity || quantity < 1) {
      return;
    }

    const last = this.items.at(this.items.length - 1);

    if (!last.value.serviceId) {
      last.patchValue({ serviceId, quantity });
      return;
    }

    this.addItem();
    this.items.at(this.items.length - 1).patchValue({ serviceId, quantity });
  }

  onDeleteItem(event: any): void {
    const row = event?.data ?? event;
    const index = row?.index;

    if (index === undefined || index === null) {
      return;
    }

    if (this.items.length === 1) {
      this.items.at(0).patchValue({ serviceId: null, quantity: 1 });
    } else {
      this.removeItem(index);
    }
  }

  createBill(): void {
    if (this.billForm.invalid) {
      this.billForm.markAllAsTouched();
      return;
    }

    const request = this.billForm.getRawValue() as CreateBillRequest;

    this.billingService.createBill(request).subscribe({
      next: (response) => {
        console.log('Bill created successfully:', response);
      },
      error: (error) => {
        console.error('Error creating bill:', error);
      },
    });
  }
}