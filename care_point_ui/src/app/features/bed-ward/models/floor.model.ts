export interface Floor {
  floorId: number;
  floorNumber: number;
  floorName: string;
  description: string;
  active: boolean;
}

export interface FloorRequest {
  floorNumber: number;
  floorName: string;
  description: string;
  active: boolean;
}