export interface Ward {
  wardId: number;
  departmentId: number;
  floorId: number;
  wardName: string;
  wardType: string;
  active: boolean;
}

export interface WardRequest {
  departmentId: number;
  floorId: number;
  wardName: string;
  wardType: string;
  active: boolean;
}