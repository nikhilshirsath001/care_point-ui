import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TabViewModule } from 'primeng/tabview';

import {
  SharedTableComponent,
  SharedTableConfig,
  TableColumn,
} from '../../../../shared/shared-table/shared-table.component';

import { SharedDetailsComponent } from '../../../../shared/shared-details/shared-details.component';

import { WardFormComponent } from '../../components/ward-form/ward-form.component';
import { RoomFormComponent } from '../../components/room-form/room-form.component';

import { Ward } from '../../models/ward.model';
import { Room } from '../../models/room.model';

import { BedWardService } from '../../services/bed-ward.service';



import {
  ROOM_COLUMNS,
  ROOM_TABLE_CONFIG,
  ROOM_DETAILS_FIELDS,
} from '../../config/room-table.config';
import { FloorFormComponent } from '../../components/floor-form/floor-form.component';
import { FLOOR_COLUMNS, FLOOR_TABLE_CONFIG } from '../../config/floor-table.config';
import { WARD_COLUMNS, WARD_TABLE_CONFIG } from '../../config/ward-table.config';
import { Floor } from '../../models/floor.model';

type InfrastructureType = 'floor' | 'ward' | 'room';

@Component({
  selector: 'app-wards',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    DialogModule,
    TabViewModule,
    SharedTableComponent,
    SharedDetailsComponent,
    FloorFormComponent,
    WardFormComponent,
    RoomFormComponent,
  ],
  templateUrl: './wards.component.html',
  styleUrl: './wards.component.css',
})
export class WardsComponent implements OnInit {
  // =========================================================
  // TABLE CONFIGURATION
  // =========================================================

  floorColumns: TableColumn[] = FLOOR_COLUMNS;
  floorTableConfig: SharedTableConfig = FLOOR_TABLE_CONFIG;

  wardColumns: TableColumn[] = WARD_COLUMNS;
  wardTableConfig: SharedTableConfig = WARD_TABLE_CONFIG;

  roomColumns: TableColumn[] = ROOM_COLUMNS;
  roomTableConfig: SharedTableConfig = ROOM_TABLE_CONFIG;

  floorDetailsFields : any;
  wardDetailsFields :any;
  roomDetailsFields = ROOM_DETAILS_FIELDS;

  // =========================================================
  // SOURCE AND FILTERED DATA
  // =========================================================

  floors: Floor[] = [];
  filteredFloors: Floor[] = [];

  wards: Ward[] = [];
  filteredWards: Ward[] = [];

  rooms: Room[] = [];
  filteredRooms: Room[] = [];

  loadingFloors = false;
  loadingWards = false;
  loadingRooms = false;

  // =========================================================
  // FORM STATE
  // =========================================================

  showFloorForm = false;
  floorFormMode: 'create' | 'edit' = 'create';
  selectedFloor: Floor | null = null;

  showWardForm = false;
  wardFormMode: 'create' | 'edit' = 'create';
  selectedWard: Ward | null = null;

  showRoomForm = false;
  roomFormMode: 'create' | 'edit' = 'create';
  selectedRoom: Room | null = null;

  // =========================================================
  // DETAILS STATE
  // =========================================================

  showDetails = false;
  detailsTitle = '';
  selectedRecord: any = null;
  detailsFields: any[] = [];

  constructor(private readonly bedWardService: BedWardService) {}

  ngOnInit(): void {
    this.loadFloors();
    this.loadWards();
    this.loadRooms();
  }

  // =========================================================
  // LOAD FLOORS
  // =========================================================

  loadFloors(): void {
    this.loadingFloors = true;

    this.bedWardService.getAllFloors().subscribe({
      next: (response: any) => {
        this.floors = response?.data?.content ?? response?.data ?? [];
        this.filteredFloors = [...this.floors];
        this.loadingFloors = false;
      },
      error: (error:any) => {
        console.error('Failed to load floors', error);
        this.loadingFloors = false;
      },
    });
  }

  // =========================================================
  // LOAD WARDS
  // =========================================================

  loadWards(): void {
    this.loadingWards = true;

    this.bedWardService.getAllWards().subscribe({
      next: (response: any) => {
        this.wards = response?.data?.content ?? response?.data ?? [];
        this.filteredWards = [...this.wards];
        this.loadingWards = false;
      },
      error: (error) => {
        console.error('Failed to load wards', error);
        this.loadingWards = false;
      },
    });
  }

  // =========================================================
  // LOAD ROOMS
  // =========================================================

  loadRooms(): void {
    this.loadingRooms = true;

    // Important: this must call the Rooms API, not getAllBeds().
    this.bedWardService.getAllRooms().subscribe({
      next: (response: any) => {
        this.rooms = response?.data?.content ?? response?.data ?? [];
        this.filteredRooms = [...this.rooms];
        this.loadingRooms = false;
      },
      error: (error) => {
        console.error('Failed to load rooms', error);
        this.loadingRooms = false;
      },
    });
  }

  // =========================================================
  // FLOOR CRUD
  // =========================================================

  openCreateFloorForm(): void {
    this.floorFormMode = 'create';
    this.selectedFloor = null;
    this.showFloorForm = true;
  }

  openEditFloorForm(event: any): void {
    const floor = event?.floor ?? event;
    if (!floor) return;

    this.floorFormMode = 'edit';
    this.selectedFloor = { ...floor };
    this.showFloorForm = true;
  }

  onFloorSaved(): void {
    this.showFloorForm = false;
    this.selectedFloor = null;
    this.loadFloors();
  }

  onFloorFormCancelled(): void {
    this.showFloorForm = false;
    this.selectedFloor = null;
  }

  deleteFloor(event: any): void {
    const floor = event?.floor ?? event;
    const id = floor?.floorId;

    if (id == null) {
      console.error('Floor ID is missing', event);
      return;
    }

    if (!window.confirm('Are you sure you want to delete this floor?')) {
      return;
    }

    this.bedWardService.deleteFloor(id).subscribe({
      next: () => this.loadFloors(),
      error: (error) => {
        console.error('Failed to delete floor', error);
      },
    });
  }

  // =========================================================
  // WARD CRUD
  // =========================================================

  openCreateWardForm(): void {
    this.wardFormMode = 'create';
    this.selectedWard = null;
    this.showWardForm = true;
  }

  openEditWardForm(event: any): void {
    const ward = event?.ward ?? event;
    if (!ward) return;

    this.wardFormMode = 'edit';
    this.selectedWard = { ...ward };
    this.showWardForm = true;
  }

  onWardSaved(): void {
    this.showWardForm = false;
    this.selectedWard = null;
    this.loadWards();
  }

  onWardFormCancelled(): void {
    this.showWardForm = false;
    this.selectedWard = null;
  }

  deleteWard(event: any): void {
    const ward = event?.ward ?? event;
    const id = ward?.wardId;

    if (id == null) {
      console.error('Ward ID is missing', event);
      return;
    }

    if (!window.confirm('Are you sure you want to delete this ward?')) {
      return;
    }

    this.bedWardService.deleteWard(id).subscribe({
      next: () => this.loadWards(),
      error: (error) => {
        console.error('Failed to delete ward', error);
      },
    });
  }

  // =========================================================
  // ROOM CRUD
  // =========================================================

  openCreateRoomForm(): void {
    this.roomFormMode = 'create';
    this.selectedRoom = null;
    this.showRoomForm = true;
  }

  openEditRoomForm(event: any): void {
    const room = event?.room ?? event;
    if (!room) return;

    this.roomFormMode = 'edit';
    this.selectedRoom = { ...room };
    this.showRoomForm = true;
  }

  onRoomSaved(): void {
    this.showRoomForm = false;
    this.selectedRoom = null;
    this.loadRooms();
  }

  onRoomFormCancelled(): void {
    this.showRoomForm = false;
    this.selectedRoom = null;
  }

  deleteRoom(event: any): void {
    const room = event?.room ?? event;
    const id = room?.roomId;

    if (id == null) {
      console.error('Room ID is missing', event);
      return;
    }

    if (!window.confirm('Are you sure you want to delete this room?')) {
      return;
    }

    this.bedWardService.deleteRoom(id).subscribe({
      next: () => this.loadRooms(),
      error: (error) => {
        console.error('Failed to delete room', error);
      },
    });
  }

  // =========================================================
  // SEARCH
  // =========================================================

  onFloorSearch(value: any): void {
    this.filteredFloors = this.filterRecords(this.floors, value, [
      'floorName',
      'floorNumber',
      'name',
      'description',
    ]);
  }

  onWardSearch(value: any): void {
    this.filteredWards = this.filterRecords(this.wards, value, [
      'wardName',
      'name',
      'wardType',
      'description',
    ]);
  }

  onRoomSearch(value: any): void {
    this.filteredRooms = this.filterRecords(this.rooms, value, [
      'roomNumber',
      'roomName',
      'name',
      'roomType',
    ]);
  }

  private filterRecords<T>(
    records: T[],
    value: any,
    fields: string[],
  ): T[] {
    const term = String(
      typeof value === 'string'
        ? value
        : value?.searchTerm ?? value?.value ?? value?.term ?? '',
    )
      .trim()
      .toLowerCase();

    if (!term) return [...records];

    return records.filter((record: any) =>
      fields.some((field) =>
        String(record?.[field] ?? '').toLowerCase().includes(term),
      ),
    );
  }

  // =========================================================
  // VIEW DETAILS
  // =========================================================

  viewFloor(event: any): void {
    this.openDetails('Floor Details', event?.floor ?? event, this.floorDetailsFields);
  }

  viewWard(event: any): void {
    this.openDetails('Ward Details', event?.ward ?? event, this.wardDetailsFields);
  }

  viewRoom(event: any): void {
    this.openDetails('Room Details', event?.room ?? event, this.roomDetailsFields);
  }

  private openDetails(
    title: string,
    record: any,
    fields: any[],
  ): void {
    if (!record) return;

    this.detailsTitle = title;
    this.selectedRecord = record;
    this.detailsFields = fields;
    this.showDetails = true;
  }
}