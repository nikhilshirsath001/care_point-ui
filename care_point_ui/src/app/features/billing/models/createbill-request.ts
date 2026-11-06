export interface CreateBillRequest {
  patientId: number;
  visitId?: number;
  admissionId?: number;
  discount: number;
  tax: number;
  items: CreateBillItemRequest[];
}

export interface CreateBillItemRequest {
  serviceId: number;
  quantity: number;
}