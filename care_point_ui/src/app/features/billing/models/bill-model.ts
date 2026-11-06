export interface BillModel {
  billId: number;
  billNo: string;
  patientId: number;
  visitId: number | null;
  admissionId: number | null;
  billDate: string;
  subtotal: number;
  discount: number;
  tax: number;
  totalAmount: number;
  paidAmount: number;
  balanceAmount: number;
  status: string;
  items: BillItemModel[];
  payments: unknown[];
}

export interface BillItemModel {
  billItemId: number;
  serviceId: number;
  serviceName: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  amount: number;
}