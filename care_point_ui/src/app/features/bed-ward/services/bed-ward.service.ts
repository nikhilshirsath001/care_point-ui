import { Injectable } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { API_ENDPOINTS } from '../../../core/constants/api-endpoints';

@Injectable({
  providedIn: 'root',
})
export class BedWardService {
  constructor(private apiService: ApiService) {}

  getAllWards() {
    return this.apiService.getObservable(API_ENDPOINTS.BED_WARD.GET_ALL_WARDS);
  }

  getAllRooms() {
    return this.apiService.getObservable(API_ENDPOINTS.BED_WARD.GET_ALL_ROOMS);
  }

  getAllBeds() {
    return this.apiService.getObservable(API_ENDPOINTS.BED_WARD.GET_ALL_BEDS);
  }

  getAllFloors() {
    return this.apiService.getObservable(API_ENDPOINTS.BED_WARD.GET_ALL_FLOOR);
  }

  getRoomBaseOnWardId(wardId: number) {
    return this.apiService.getObservable(
      `${API_ENDPOINTS.BED_WARD.GET_ROOMS_BY_WARD_ID}/${wardId}`,
    );
  }

  getAvailableBedsBasedOnRoomId(roomId: number) {
    return this.apiService.getObservable(
      `${API_ENDPOINTS.BED_WARD.GET_AVAILABLE_BEDS_BY_ROOM_ID}/${roomId}`,
    );
  }

  assignBedToPatient(bedAssignmentObj: any) {
    return this.apiService.postObservable(
      API_ENDPOINTS.BED_WARD.ASSIGN_BED,
      bedAssignmentObj,
    );
  }

  createWard(obj: any) {
    return this.apiService.postObservable(
      API_ENDPOINTS.BED_WARD.CREATE_WARD,
      obj,
    );
  }

  createRoom(obj: any) {
    return this.apiService.postObservable(
      API_ENDPOINTS.BED_WARD.CREATE_ROOM,
      obj,
    );
  }

  createBed(obj: any) {
    return this.apiService.postObservable(
      API_ENDPOINTS.BED_WARD.CREATE_BED,
      obj,
    );
  }

  createFloor(obj: any) {
    return this.apiService.postObservable(
      API_ENDPOINTS.BED_WARD.CREATE_FLOOR,
      obj,
    );
  }

  updateWard(id: number, obj: any) {
    return this.apiService.putObservable(
      `${API_ENDPOINTS.BED_WARD.UPDATE_WARD}?wardId=${id}`,
      obj,
    );
  }

  updateRoom(id: number, obj: any) {
    return this.apiService.putObservable(
      `${API_ENDPOINTS.BED_WARD.UPDATE_ROOM}?roomId=${id}`,
      obj,
    );
  }

  updateBed(id: number, obj: any) {
    return this.apiService.putObservable(
      `${API_ENDPOINTS.BED_WARD.UPDATE_BED}?bedId=${id}`,
      obj,
    );
  }

  updateFloor(id: number, obj: any) {
    return this.apiService.putObservable(
      `${API_ENDPOINTS.BED_WARD.UPDATE_FLOOR}?floorId=${id}`,
      obj,
    );
  }

  deleteWard(id: any) {
    return this.apiService.getObservable(
      `${API_ENDPOINTS.BED_WARD.DELETE_WARD}?wardId=${id}`,
    );
  }

  deleteRoom(id: any) {
    return this.apiService.getObservable(
      `${API_ENDPOINTS.BED_WARD.DELETE_ROOM}?roomId=${id}`,
    );
  }

  deleteBed(id: any) {
    return this.apiService.getObservable(
      `${API_ENDPOINTS.BED_WARD.DELETE_BED}?bedId=${id}`,
    );
  }

  deleteFloor(id: any) {
    return this.apiService.getObservable(
      `${API_ENDPOINTS.BED_WARD.DELETE_FLOOR}?floorId=${id}`,
    );
  }
}
