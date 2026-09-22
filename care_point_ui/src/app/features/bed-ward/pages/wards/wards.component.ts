import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TabViewModule } from 'primeng/tabview';

import {
  SharedTableComponent,
  SharedTableConfig,
  TableColumn
} from '../../../../shared/shared-table/shared-table.component';

import { WardFormComponent } from '../../components/ward-form/ward-form.component';
import { RoomFormComponent } from '../../components/room-form/room-form.component';

import { Ward } from '../../models/ward.model';

import { BedWardService } from '../../services/bed-ward.service';


import { Room } from '../../models/room.model';
import { WARD_COLUMNS, WARD_TABLE_CONFIG } from '../../config/ward-table.config';
import { ROOM_COLUMNS, ROOM_TABLE_CONFIG } from '../../config/room-table.config';


@Component({
  selector: 'app-wards',
  imports: [   
    CommonModule,
    ButtonModule,
    DialogModule,
    TabViewModule,

    SharedTableComponent,

    WardFormComponent,
    RoomFormComponent],
  templateUrl: './wards.component.html',
  styleUrl: './wards.component.css'
})
export class WardsComponent  implements OnInit {

  // =========================================================
  // WARD TABLE
  // =========================================================

  wardColumns: TableColumn[] = WARD_COLUMNS;

  wardTableConfig: SharedTableConfig = WARD_TABLE_CONFIG;

  wards: Ward[] = [];


  // =========================================================
  // ROOM TABLE
  // =========================================================

  roomColumns: TableColumn[] = ROOM_COLUMNS;

  roomTableConfig: SharedTableConfig = ROOM_TABLE_CONFIG;

  rooms: Room[] = [];


  // =========================================================
  // COMMON STATE
  // =========================================================

  loading = false;


  // =========================================================
  // WARD FORM
  // =========================================================

  showWardForm = false;

  wardFormMode: 'create' | 'edit' = 'create';

  selectedWard: Ward | null = null;


  // =========================================================
  // ROOM FORM
  // =========================================================

  showRoomForm = false;

  roomFormMode: 'create' | 'edit' = 'create';

  selectedRoom: Room | null = null;


  // =========================================================
  // CONSTRUCTOR
  // =========================================================

  constructor(
    private bedWardService: BedWardService
  ) {}


  // =========================================================
  // INIT
  // =========================================================

  ngOnInit(): void {

    this.loadWards();

    this.loadRooms();

  }


  // =========================================================
  // LOAD WARDS
  // =========================================================

  loadWards(): void {

    this.loading = true;

    // this.bedWardService
    //   .getWards()
    //   .subscribe({

    //     next: (response) => {

    //       this.wards = response?.data ?? [];

    //       this.loading = false;

    //     },

    //     error: (error) => {

    //       console.error(
    //         'Failed to load wards',
    //         error
    //       );

    //       this.loading = false;

    //     }

    //   });

  }


  // =========================================================
  // LOAD ROOMS
  // =========================================================

  loadRooms(): void {

    this.loading = true;

    // this.bedWardService
    //   .getRooms()
    //   .subscribe({

    //     next: (response) => {

    //       this.rooms = response?.data ?? [];

    //       this.loading = false;

    //     },

    //     error: (error) => {

    //       console.error(
    //         'Failed to load rooms',
    //         error
    //       );

    //       this.loading = false;

    //     }

    //   });

  }


  // =========================================================
  // CREATE WARD
  // =========================================================

  openCreateWardForm(): void {

    this.wardFormMode = 'create';

    this.selectedWard = null;

    this.showWardForm = true;

  }


  // =========================================================
  // EDIT WARD
  // =========================================================

  openEditWardForm(
    ward: Ward
  ): void {

    this.wardFormMode = 'edit';

    this.selectedWard = {
      ...ward
    };

    this.showWardForm = true;

  }


  // =========================================================
  // WARD SAVED
  // =========================================================

  onWardSaved(): void {

    this.showWardForm = false;

    this.selectedWard = null;

    this.loadWards();

  }


  // =========================================================
  // WARD CANCEL
  // =========================================================

  onWardFormCancelled(): void {

    this.showWardForm = false;

    this.selectedWard = null;

  }


  // =========================================================
  // CREATE ROOM
  // =========================================================

  openCreateRoomForm(): void {

    this.roomFormMode = 'create';

    this.selectedRoom = null;

    this.showRoomForm = true;

  }


  // =========================================================
  // EDIT ROOM
  // =========================================================

  openEditRoomForm(
    room: Room
  ): void {

    this.roomFormMode = 'edit';

    this.selectedRoom = {
      ...room
    };

    this.showRoomForm = true;

  }


  // =========================================================
  // ROOM SAVED
  // =========================================================

  onRoomSaved(): void {

    this.showRoomForm = false;

    this.selectedRoom = null;

    this.loadRooms();

  }


  // =========================================================
  // ROOM CANCEL
  // =========================================================

  onRoomFormCancelled(): void {

    this.showRoomForm = false;

    this.selectedRoom = null;

  }

}