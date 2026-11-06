import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { BillingService } from '../../services/billing.service';
import { BillModel } from '../../models/bill-model';

@Component({
  selector: 'app-bill-list',
  standalone: true,
  imports: [CommonModule, TableModule],
  templateUrl: './bill-list.component.html',
  styleUrl: './bill-list.component.css',
})
export class BillListComponent implements OnInit {
  private readonly billingService = inject(BillingService);

  bills: BillModel[] = [];
  loading = false;

  ngOnInit(): void {
    this.loadBills();
  }

  loadBills(): void {
    this.loading = true;

    this.billingService.getAllBills().subscribe({
      next: (response) => {
        this.bills = response.data ?? [];
        this.loading = false;
      },
      error: (error) => {
        console.error('Failed to load bills:', error);
        this.loading = false;
      },
    });
  }
}
