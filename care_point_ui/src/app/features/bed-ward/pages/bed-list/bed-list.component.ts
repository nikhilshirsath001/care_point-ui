
import { Component, OnInit } from '@angular/core';
import { NgClass } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';

import { DynamicFormComponent } from '../../../../shared/dynamic-form/dynamic-form.component';

import { BedWardService } from '../../services/bed-ward.service';
import { Bed } from '../../models/bed.model';

import { DynamicFormConfig } from '../../../../core/models/dynamic-form.model';
import { BED_FORM_CONFIG } from '../../config/bed-form.config';

@Component({
  selector: 'app-bed-list',
  standalone: true,
  imports: [
    DialogModule,
    DynamicFormComponent,
    FormsModule,
    NgClass
  ],
  templateUrl: './bed-list.component.html',
  styleUrl: './bed-list.component.css',
})
export class BedListComponent implements OnInit {

  floors: any[] = [];
  wards: any[] = [];
  rooms: any[] = [];
  beds: Bed[] = [];

  selectedFloorId: number | null = null;
  selectedFloorName: string | null = null;
  selectedWardId: number | null = null;

  selectedFilter = 'ALL';

  loadingFloors = false;
  loadingWards = false;
  loadingRooms = false;
  saving = false;

  showForm = false;
  formMode: 'create' | 'edit' = 'create';

  selectedBed: Bed | null = null;

  private wardRequestId = 0;
  private roomRequestId = 0;
  private formWardId: number | null = null;

  readonly filters = [
    { label: 'All Beds', value: 'ALL' },
    { label: 'Available', value: 'AVAILABLE' },
    { label: 'Occupied', value: 'OCCUPIED' },
    { label: 'Reserved', value: 'RESERVED' },
    { label: 'Maintenance', value: 'MAINTENANCE' },
    { label: 'Blocked', value: 'BLOCKED' },
  ];

  // Shared dynamic form configuration
  formConfig: DynamicFormConfig = {
    ...BED_FORM_CONFIG,
    fields: BED_FORM_CONFIG.fields.map(field => ({
      ...field,
      options: field.options ? [...field.options] : undefined,
    })),
  };

  constructor(private bedWardService: BedWardService) {}

  ngOnInit(): void {
    this.loadFloors();
  }

  // ==============================
  // FLOOR MANAGEMENT
  // ==============================

  loadFloors(): void {
    this.loadingFloors = true;

    this.bedWardService
      .getAllFloors()
      .pipe(finalize(() => this.loadingFloors = false))
      .subscribe({
        next: (response: any) => {
          this.floors = response?.data ?? [];
        },
        error: error => {
          console.error('Failed to load floors', error);
        },
      });
  }

  onFloorChange(floorId: number | null): void {

    this.selectedFloorId = floorId;

    const selectedFloor = this.floors.find(
      floor => Number(floor.floorId) === Number(floorId)
    );

    this.selectedFloorName = selectedFloor?.floorName ?? null;

    this.selectedWardId = null;

    this.wards = [];
    this.rooms = [];
    this.beds = [];

    this.selectedFilter = 'ALL';

    const requestId = ++this.wardRequestId;

    ++this.roomRequestId;

    this.loadingWards = false;
    this.loadingRooms = false;

    if (!this.selectedFloorName) {
      return;
    }

    this.loadWards(this.selectedFloorName, requestId);
  }

  loadWards(floorName: string, requestId: number): void {

    this.loadingWards = true;

    this.bedWardService
      .getWardsByFloor(floorName)
      .pipe(
        finalize(() => {
          if (requestId === this.wardRequestId) {
            this.loadingWards = false;
          }
        })
      )
      .subscribe({

        next: (response: any) => {

          if (requestId !== this.wardRequestId) return;

          this.wards = response?.data ?? [];
        },

        error: error => {
          console.error('Failed to load wards', error);
        },

      });
  }

  // ==============================
  // WARD MANAGEMENT
  // ==============================

  onWardChange(wardId: number | null): void {

    this.selectedWardId = wardId;

    this.rooms = [];
    this.beds = [];

    this.selectedFilter = 'ALL';

    const requestId = ++this.roomRequestId;

    this.loadingRooms = false;

    if (!wardId) {
      return;
    }

    this.loadRooms(wardId, requestId);
  }

  // ==============================
  // ROOM MANAGEMENT
  // ==============================

  loadRooms(wardId: number, requestId: number): void {

    this.loadingRooms = true;

    this.bedWardService
      .getRoomBaseOnWardId(wardId)
      .pipe(
        finalize(() => {
          if (requestId === this.roomRequestId) {
            this.loadingRooms = false;
          }
        })
      )
      .subscribe({

        next: (response: any) => {

          if (requestId !== this.roomRequestId) return;

          const allRooms = response?.data ?? [];

          const wardRooms = allRooms.filter(
            (room: any) => Number(room.wardId) === Number(wardId)
          );

          this.rooms = wardRooms.map((room: any) => ({
            ...room,
            beds: [],
          }));

          this.loadBeds(requestId);
        },

        error: error => {
          console.error('Failed to load rooms', error);
        },

      });
  }

  loadBeds(requestId: number): void {

    this.bedWardService.getAllBeds().subscribe({

      next: (response: any) => {

        if (requestId !== this.roomRequestId) return;

        const allBeds = response?.data ?? [];

        this.beds = allBeds;

        this.rooms = this.rooms.map(room => ({
          ...room,
          beds: allBeds.filter(
            (bed: any) => Number(bed.roomId) === Number(room.roomId)
          ),
        }));
      },

      error: error => {
        console.error('Failed to load beds', error);
      },

    });
  }

  // ==============================
  // BED STATISTICS
  // ==============================

  get filteredRooms(): any[] {

    return this.rooms.map(room => ({
      ...room,
      beds: (room.beds ?? []).filter(
        (bed: Bed) =>
          this.selectedFilter === 'ALL' ||
          bed.status === this.selectedFilter
      ),
    }));
  }

  get totalBeds(): number {

    return this.rooms.reduce(
      (total, room) => total + (room.beds?.length ?? 0),
      0
    );
  }

  getStatusCount(status: string): number {

    return this.rooms.reduce((total, room) => {

      return total + (room.beds ?? []).filter(
        (bed: Bed) => bed.status === status
      ).length;

    }, 0);
  }

  getBedColor(status: string): string {

    const colors: Record<string, string> = {
      AVAILABLE: 'available',
      OCCUPIED: 'occupied',
      RESERVED: 'reserved',
      MAINTENANCE: 'maintenance',
      BLOCKED: 'blocked',
    };

    return colors[status] ?? 'available';
  }

  // ==============================
  // DYNAMIC FORM HELPERS
  // ==============================

  private getField(name: string) {
    return this.formConfig.fields.find(
      field => field.name === name
    );
  }

  private prepareBedForm(): void {

  this.formWardId = Number(this.selectedBed?.wardId) || null;

  this.roomRequestId++;

  const roomField = this.getField('roomId');

  if (roomField) {
    roomField.options = [];
  }

  this.loadFormWardOptions();

  if (this.formWardId) {
    this.loadFormRoomOptions(this.formWardId);
  }
}

  private loadFormWardOptions(): void {

  this.bedWardService.getAllWards().subscribe({

    next: (response: any) => {

      const wards = response?.data ?? [];

      const wardField = this.getField('wardId');

      if (!wardField) return;

      wardField.options = wards
        .filter((ward: any) => ward.active)
        .map((ward: any) => ({
          label: ward.wardName,
          value: Number(ward.wardId),
        }));

      this.formConfig = {
        ...this.formConfig,
        fields: [...this.formConfig.fields],
      };

    },

    error: error => {
      console.error('Failed to load wards', error);
    },

  });
}

  // ==============================
  // DEPENDENT ROOM DROPDOWN
  // ==============================

  onFieldChange(formData: Record<string, any>): void {

    const wardId = Number(formData['wardId']);

    if (!wardId || wardId === this.formWardId) {
      return;
    }

    this.formWardId = wardId;

    const roomField = this.getField('roomId');

    if (roomField) {
      roomField.options = [];
    }

    this.loadFormRoomOptions(wardId);
  }

  private loadFormRoomOptions(wardId: number): void {

    const requestId = ++this.roomRequestId;

    const roomField = this.getField('roomId');

    if (roomField) {
      roomField.options = [];
    }

    this.bedWardService
      .getRoomBaseOnWardId(wardId)
      .subscribe({

        next: (response: any) => {

          if (requestId !== this.roomRequestId) return;

          const rooms = response?.data ?? [];

          if (roomField) {

            roomField.options = rooms.map((room: any) => ({
              label: room.roomNumber,
              value: Number(room.roomId),
            }));

          }
        },

        error: error => {

          if (requestId === this.roomRequestId) {
            console.error('Failed to load form rooms', error);
          }

        },

      });
  }

  // ==============================
  // OPEN CREATE FORM
  // ==============================

  openCreateForm(room: any): void {
    console.log('Opening create form for room:', room);
    this.formMode = 'create';

      this.selectedBed = {
        roomId: Number(room.roomId),
        wardId: Number(room.wardId),
      } as Bed;

    this.showForm = true;

    this.prepareBedForm();
  }

  // ==============================
  // OPEN EDIT FORM
  // ==============================

  openEditForm(bed: Bed, room: any): void {

    this.formMode = 'edit';

    this.selectedBed = {
      ...structuredClone(bed),
      floorId: this.selectedFloorId!,
      floorName: this.selectedFloorName!,
      wardId: this.selectedWardId!,
      roomId: room.roomId,
      roomNumber: room.roomNumber,
      roomType: room.roomType,
    } as Bed;

    this.showForm = true;

    this.prepareBedForm();
  }

  // ==============================
  // CREATE / UPDATE BED
  // ==============================

  onSubmit(formData: Record<string, any>): void {

    if (this.saving) return;

    const payload = {
      roomId: Number(formData['roomId']),
      bedNumber: String(formData['bedNumber'] ?? '').trim(),
      status: formData['status'],
    };

    if (!payload.roomId || !payload.bedNumber || !payload.status) {

      console.error('Please fill all required fields.');

      return;
    }

    this.saving = true;

    if (this.formMode === 'create') {
      this.createBed(payload);
    } else {
      this.updateBed(payload);
    }
  }

  private createBed(payload: {
    roomId: number;
    bedNumber: string;
    status: string;
  }): void {

    this.bedWardService
      .createBed(payload)
      .pipe(finalize(() => this.saving = false))
      .subscribe({

        next: () => {

          console.log('Bed created successfully');

          this.onBedSaved();
        },

        error: error => {
          console.error('Failed to create bed:', error);
        },

      });
  }

  private updateBed(payload: {
    roomId: number;
    bedNumber: string;
    status: string;
  }): void {

    const bedId =
      (this.selectedBed as any)?.bedId ??
      (this.selectedBed as any)?.id;

    if (bedId == null) {

      this.saving = false;

      console.error('Cannot update bed: Bed ID is missing.');

      return;
    }

    this.bedWardService
      .updateBed(bedId, payload)
      .pipe(finalize(() => this.saving = false))
      .subscribe({

        next: () => {
          this.onBedSaved();
        },

        error: error => {
          console.error('Failed to update bed:', error);
        },

      });
  }

  // ==============================
  // CLOSE FORM / REFRESH
  // ==============================

  onBedSaved(): void {

    this.showForm = false;

    this.selectedBed = null;

    if (this.selectedWardId !== null) {

      this.loadRooms(
        this.selectedWardId,
        ++this.roomRequestId
      );
    }
  }

  onFormCancelled(): void {

    this.showForm = false;

    this.selectedBed = null;

    this.roomRequestId++;
  }

}
