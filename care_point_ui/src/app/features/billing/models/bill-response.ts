export interface BillResponse {
  billId: number;
  billNo: string;
  patientId: number;
  visitId?: number;
  admissionId?: number;
  billDate: string;
  subtotal: number;
  discount: number;
  tax: number;
  totalAmount: number;
  paidAmount: number;
  balanceAmount: number;
  status: BillStatus;
  items: BillItemResponse[];
  payments: PaymentResponse[];
}

export interface BillItemResponse {
  billItemId: number;
  serviceId: number;
  serviceName: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  amount: number;
}

export interface PaymentResponse {
  paymentId: number;
  amount: number;
  paymentMethod: string;
  transactionReference: string;
  paymentStatus: string;
  paymentDate: string;
}

export type BillStatus =
  | 'DRAFT'
  | 'PENDING'
  | 'PARTIALLY_PAID'
  | 'PAID'
  | 'CANCELLED';

  
  export interface BillingApiResponse<T> {
  status: number;
  message: string;
  data: T;
  totalRecords?: number;
}