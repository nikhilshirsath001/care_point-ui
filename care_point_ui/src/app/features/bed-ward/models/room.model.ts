export interface Room {
  roomId: number;
  wardId: number;
  roomNumber: string;
  roomType: string;
  status: string;
}

export interface RoomRequest {
  wardId: number;
  roomNumber: string;
  roomType: string;
  status: string;
}