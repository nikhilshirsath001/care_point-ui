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
}
