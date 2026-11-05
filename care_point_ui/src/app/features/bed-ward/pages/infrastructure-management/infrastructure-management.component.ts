import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { finalize } from 'rxjs';

import { BedWardService } from '../../services/bed-ward.service';

import { Floor } from '../../models/floor.model';
import { Ward } from '../../models/ward.model';
import { Room } from '../../models/room.model';
import { Bed } from '../../models/bed.model';

import { FloorFormComponent } from '../../components/floor-form/floor-form.component';
import { WardFormComponent } from '../../components/ward-form/ward-form.component';
import { RoomFormComponent } from '../../components/room-form/room-form.component';

import { DynamicFormComponent } from '../../../../shared/dynamic-form/dynamic-form.component';

import { DynamicFormConfig } from '../../../../core/models/dynamic-form.model';
import { BED_FORM_CONFIG } from '../../config/bed-form.config';
import { WARD_FORM_CONFIG } from '../../config/ward-form.config';
import { PatientSearchComponent, PatientSearchConfig } from '../../../../shared/patient-search/patient-search.component';
import { PatientService } from '../../../patient/services/patient-service.service';

type InfrastructureLevel = 'floors' | 'wards' | 'rooms' | 'beds';
type ViewMode = 'grid' | 'list';

interface InfrastructureContext {
  floorId: number | null;
  floorName: string | null;
  wardId: number | null;
  wardName: string | null;
  roomId: number | null;
  roomNumber: string | null;
}

@Component({
  selector: 'app-infrastructure-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    FloorFormComponent,
    WardFormComponent,
    RoomFormComponent,
    DynamicFormComponent,
    PatientSearchComponent,
  ],
  templateUrl: './infrastructure-management.component.html',
  styleUrl: './infrastructure-management.component.css',
})
export class InfrastructureManagementComponent implements OnInit {
  floors: Floor[] = [];
  wards: Ward[] = [];
  rooms: Room[] = [];
  beds: Bed[] = [];

  loading = false;
  saving = false;

  activeLevel: InfrastructureLevel = 'floors';

  viewMode: ViewMode = 'grid';

  searchTerm = '';

  selectedBedFilter = 'ALL';

  context: InfrastructureContext = {
    floorId: null,
    floorName: null,
    wardId: null,
    wardName: null,
    roomId: null,
    roomNumber: null,
  };

  private requestId = 0;

  readonly bedFilters = [
    { label: 'All Beds', value: 'ALL' },
    { label: 'Available', value: 'AVAILABLE' },
    { label: 'Occupied', value: 'OCCUPIED' },
    { label: 'Reserved', value: 'RESERVED' },
    { label: 'Maintenance', value: 'MAINTENANCE' },
    { label: 'Blocked', value: 'BLOCKED' },
  ];

  showFloorForm = false;
  floorFormMode: 'create' | 'edit' = 'create';
  selectedFloor: Floor | null = null;

  wardFormConfig = WARD_FORM_CONFIG;
  showWardForm = false;
  wardFormMode: 'create' | 'edit' = 'create';
  selectedWard: Ward | null = null;

  showRoomForm = false;
  roomFormMode: 'create' | 'edit' = 'create';
  selectedRoom: Room | null = null;

  showBedForm = false;
  bedFormMode: 'create' | 'edit' = 'create';
  selectedBed: Bed | null = null;

  formConfig: DynamicFormConfig = {
    ...BED_FORM_CONFIG,
    fields: BED_FORM_CONFIG.fields.map((field) => ({
      ...field,
      options: field.options ? [...field.options] : undefined,
    })),
  };

  private formWardId: number | null = null;
  private formRequestId = 0;

  showAssignmentDialog = false;

  assignment = {
    patientId: '',
    admissionId: '',
    notes: '',
  };

  readonly patientService = inject(PatientService);
  readonly searchPatientFn = (keyword: string) =>
    this.patientService.searchPatientByKeyword(keyword);

  readonly patientSearchConfig: PatientSearchConfig = {
    title: 'Find Patient',
    description:
      'Search for an existing patient using Patient ABHA ID, name or mobile number.',
    placeholder: 'Enter Patient ABHA ID, name or mobile number',
    searchButtonLabel: 'Search Patient',
    selectButtonLabel: 'Select Patient',
  };

  onPatientSelected(patient: any): void {
    console.log('Selected patient:', patient);
    if (!patient?.patientId) return;
  }

  constructor(private readonly bedWardService: BedWardService) {}

  ngOnInit(): void {
    this.loadFloors();
  }

  private extractArray(response: any): any[] {
    const data = response?.data?.content ?? response?.data ?? [];
    return Array.isArray(data) ? data : [];
  }

  loadFloors(): void {
    this.loading = true;

    this.bedWardService
      .getAllFloors()
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (response) => {
          this.floors = this.extractArray(response);
        },
        error: (error) => {
          console.error('Failed to load floors', error);
        },
      });
  }

  selectFloor(floor: Floor): void {
    this.context = {
      floorId: Number(floor.floorId),
      floorName: floor.floorName,
      wardId: null,
      wardName: null,
      roomId: null,
      roomNumber: null,
    };

    this.wards = [];
    this.rooms = [];
    this.beds = [];

    this.activeLevel = 'wards';
    this.searchTerm = '';

    this.loadWards();
  }

  loadWards(): void {
    if (!this.context.floorId) return;

    const id = ++this.requestId;

    this.loading = true;

    this.bedWardService
      .getWardsByFloor(this.context.floorName!)
      .pipe(
        finalize(() => {
          if (id === this.requestId) this.loading = false;
        }),
      )
      .subscribe({
        next: (response) => {
          if (id !== this.requestId) return;

          const allWards = this.extractArray(response);

          this.wards = allWards.filter((ward: any) => {
            if (ward.floorId != null) {
              return Number(ward.floorId) === this.context.floorId;
            }

            if (ward.floorName != null) {
              return (
                String(ward.floorName).toLowerCase() ===
                String(this.context.floorName).toLowerCase()
              );
            }

            return true;
          });
        },

        error: (error) => {
          console.error('Failed to load wards', error);
        },
      });
  }

  selectWard(ward: Ward): void {
    this.context.wardId = Number(ward.wardId);
    this.context.wardName = ward.wardName;

    this.context.roomId = null;
    this.context.roomNumber = null;

    this.rooms = [];
    this.beds = [];

    this.activeLevel = 'rooms';
    this.searchTerm = '';

    this.loadRooms();
  }

  loadRooms(): void {
    if (!this.context.wardId) return;

    const id = ++this.requestId;

    this.loading = true;

    this.bedWardService
      .getRoomBaseOnWardId(this.context.wardId)
      .pipe(
        finalize(() => {
          if (id === this.requestId) this.loading = false;
        }),
      )
      .subscribe({
        next: (response) => {
          if (id !== this.requestId) return;

          const allRooms = this.extractArray(response);

          this.rooms = allRooms
            .filter((room: any) => Number(room.wardId) === this.context.wardId)
            .map((room: any) => ({
              ...room,
              beds: [],
            }));

          this.loadBedsForRooms(id);
        },

        error: (error) => {
          console.error('Failed to load rooms', error);
        },
      });
  }

  private loadBedsForRooms(id: number): void {
    this.bedWardService.getAllBeds().subscribe({
      next: (response) => {
        if (id !== this.requestId) return;

        this.beds = this.extractArray(response);

        this.rooms = this.rooms.map((room) => ({
          ...room,
          beds: this.beds.filter(
            (bed) => Number((bed as any).roomId) === Number(room.roomId),
          ),
        }));

        this.loading = false;
      },

      error: (error) => {
        if (id === this.requestId) {
          this.loading = false;
        }
        console.error('Failed to load beds', error);
      },
    });
  }

  selectRoom(room: Room): void {
    this.context.roomId = Number(room.roomId);
    this.context.roomNumber = String(room.roomNumber);

    this.activeLevel = 'beds';
    this.searchTerm = '';
    this.selectedBedFilter = 'ALL';

    this.loadBeds();
  }

  loadBeds(): void {
    const id = ++this.requestId;

    this.loading = true;

    this.bedWardService
      .getAllBeds()
      .pipe(
        finalize(() => {
          if (id === this.requestId) this.loading = false;
        }),
      )
      .subscribe({
        next: (response) => {
          if (id !== this.requestId) return;

          const allBeds = this.extractArray(response);

          this.beds = allBeds.filter(
            (bed) => Number((bed as any).roomId) === this.context.roomId,
          );
        },

        error: (error) => {
          console.error('Failed to load beds', error);
        },
      });
  }

  navigateTo(level: InfrastructureLevel): void {
    if (level === 'floors') {
      this.activeLevel = 'floors';
      this.searchTerm = '';
      return;
    }

    if (level === 'wards' && this.context.floorId) {
      this.activeLevel = 'wards';
      this.searchTerm = '';
      return;
    }

    if (level === 'rooms' && this.context.wardId) {
      this.activeLevel = 'rooms';
      this.searchTerm = '';
      return;
    }

    if (level === 'beds' && this.context.roomId) {
      this.activeLevel = 'beds';
      this.searchTerm = '';
      return;
    }
  }

  goBack(): void {
    switch (this.activeLevel) {
      case 'beds':
        this.activeLevel = 'rooms';
        break;

      case 'rooms':
        this.activeLevel = 'wards';
        break;

      case 'wards':
        this.activeLevel = 'floors';
        break;

      default:
        break;
    }

    this.searchTerm = '';
  }

  refreshCurrentLevel(): void {
    switch (this.activeLevel) {
      case 'floors':
        this.loadFloors();
        break;

      case 'wards':
        this.loadWards();
        break;

      case 'rooms':
        this.loadRooms();
        break;

      case 'beds':
        this.loadBeds();
        break;
    }
  }

  setView(mode: ViewMode): void {
    this.viewMode = mode;
  }

  getLevelTitle(): string {
    const titles: Record<InfrastructureLevel, string> = {
      floors: 'Hospital Floors',
      wards: 'Hospital Wards',
      rooms: 'Hospital Rooms',
      beds: 'Hospital Beds',
    };

    return titles[this.activeLevel];
  }

  private matchesSearch(values: any[]): boolean {
    const term = this.searchTerm.trim().toLowerCase();

    if (!term) return true;

    return values.some((value) =>
      String(value ?? '')
        .toLowerCase()
        .includes(term),
    );
  }

  get filteredFloors(): Floor[] {
    return this.floors.filter((floor) =>
      this.matchesSearch([floor.floorName, floor.floorNumber, floor.floorId]),
    );
  }

  get filteredWards(): Ward[] {
    return this.wards.filter((ward) =>
      this.matchesSearch([ward.wardName, ward.wardType, ward.wardId]),
    );
  }

  get filteredRooms(): Room[] {
    return this.rooms.filter((room) =>
      this.matchesSearch([
        room.roomNumber,
        room.roomType,
        (room as any).roomName,
      ]),
    );
  }

  get filteredBeds(): Bed[] {
    return this.beds.filter((bed) => {
      const matchesStatus =
        this.selectedBedFilter === 'ALL' ||
        bed.status === this.selectedBedFilter;

      const matchesTerm = this.matchesSearch([
        bed.bedNumber,
        bed.status,
        (bed as any).bedId,
      ]);

      return matchesStatus && matchesTerm;
    });
  }

  get currentDataCount(): number {
    switch (this.activeLevel) {
      case 'floors':
        return this.filteredFloors.length;

      case 'wards':
        return this.filteredWards.length;

      case 'rooms':
        return this.filteredRooms.length;

      case 'beds':
        return this.filteredBeds.length;
    }
  }

  get totalBeds(): number {
    return this.beds.length;
  }

  get availableBeds(): number {
    return this.getStatusCount('AVAILABLE');
  }

  get occupiedBeds(): number {
    return this.getStatusCount('OCCUPIED');
  }

  getStatusCount(status: string): number {
    return this.beds.filter((bed) => bed.status === status).length;
  }

  getFloorWardCount(floor: Floor): number {
    return this.wards.filter((ward: any) => {
      if (ward.floorId != null) {
        return Number(ward.floorId) === Number(floor.floorId);
      }

      return (
        String(ward.floorName ?? '').toLowerCase() ===
        String(floor.floorName ?? '').toLowerCase()
      );
    }).length;
  }

  getWardRoomCount(wardId: number): number {
    return this.rooms.filter(
      (room) => Number((room as any).wardId) === Number(wardId),
    ).length;
  }

  getWardBedCount(wardId: number): number {
    const roomIds = this.rooms
      .filter((room) => Number((room as any).wardId) === Number(wardId))
      .map((room) => Number(room.roomId));

    return this.beds.filter((bed) =>
      roomIds.includes(Number((bed as any).roomId)),
    ).length;
  }

  getRoomBedCount(roomId: number): number {
    return this.beds.filter(
      (bed) => Number((bed as any).roomId) === Number(roomId),
    ).length;
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

  openCreateFloor(): void {
    this.floorFormMode = 'create';
    this.selectedFloor = null;
    this.showFloorForm = true;
  }

  openEditFloor(floor: Floor): void {
    this.floorFormMode = 'edit';
    this.selectedFloor = { ...floor };
    this.showFloorForm = true;
  }

  onFloorSaved(): void {
    this.showFloorForm = false;
    this.selectedFloor = null;
    this.loadFloors();
  }

  onFloorCancelled(): void {
    this.showFloorForm = false;
    this.selectedFloor = null;
  }

  deleteFloor(floor: Floor): void {
    if (!confirm(`Delete floor ${floor.floorName}?`)) return;

    this.bedWardService.deleteFloor(floor.floorId).subscribe({
      next: () => {
        this.loadFloors();
      },

      error: (error) => {
        console.error('Failed to delete floor', error);
      },
    });
  }

  openCreateWard(): void {
    if (!this.context.floorId) return;

    this.wardFormMode = 'create';
    console.log(
      'Creating ward for floor:',
      this.context.floorId,
      this.context.floorName,
    );
    this.selectedWard = {
      floorId: this.context.floorId,
      floorName: this.context.floorName,
    } as unknown as Ward;
    console.log('Selected ward for creation:', this.selectedWard);
    this.showWardForm = true;
  }

  openEditWard(ward: Ward): void {
    this.wardFormMode = 'edit';

    this.selectedWard = {
      ...ward,
      floorId: this.context.floorId,
      floorName: this.context.floorName,
    } as Ward;

    this.showWardForm = true;
  }

  onWardSaved(): void {
    this.showWardForm = false;
    this.selectedWard = null;
    this.loadWards();
  }

  onWardCancelled(): void {
    this.showWardForm = false;
    this.selectedWard = null;
  }

  deleteWard(ward: Ward): void {
    if (!confirm(`Delete ward ${ward.wardName}?`)) return;

    this.bedWardService.deleteWard(ward.wardId).subscribe({
      next: () => {
        this.loadWards();
      },

      error: (error) => {
        console.error('Failed to delete ward', error);
      },
    });
  }

  openCreateRoom(): void {
    if (!this.context.wardId) return;

    this.roomFormMode = 'create';

    this.selectedRoom = {
      wardId: this.context.wardId,
      wardName: this.context.wardName,
      floorId: this.context.floorId,
      floorName: this.context.floorName,
    } as unknown as Room;

    this.showRoomForm = true;
  }

  openEditRoom(room: Room): void {
    this.roomFormMode = 'edit';

    this.selectedRoom = {
      ...room,
      wardId: this.context.wardId,
      wardName: this.context.wardName,
      floorId: this.context.floorId,
      floorName: this.context.floorName,
    } as Room;

    this.showRoomForm = true;
  }

  onRoomSaved(): void {
    this.showRoomForm = false;
    this.selectedRoom = null;
    this.loadRooms();
  }

  onRoomCancelled(): void {
    this.showRoomForm = false;
    this.selectedRoom = null;
  }

  deleteRoom(room: Room): void {
    if (!confirm(`Delete room ${room.roomNumber}?`)) return;

    this.bedWardService.deleteRoom(room.roomId).subscribe({
      next: () => {
        this.loadRooms();
      },

      error: (error) => {
        console.error('Failed to delete room', error);
      },
    });
  }

  private getField(name: string) {
    return this.formConfig.fields.find((field) => field.name === name);
  }

  private prepareBedForm(): void {
    this.formWardId = Number(this.selectedBed?.wardId) || null;

    const wardField = this.getField('wardId');
    const roomField = this.getField('roomId');

    if (wardField) {
      wardField.options = [];
    }

    if (roomField) {
      roomField.options = [];
    }

    this.formConfig = {
      ...this.formConfig,
      fields: [...this.formConfig.fields],
    };

    this.loadFormWardOptions();

    if (this.formWardId) {
      this.loadFormRoomOptions(this.formWardId);
    }
  }

  private loadFormWardOptions(): void {
    this.bedWardService.getAllWards().subscribe({
      next: (response) => {
        const wards = this.extractArray(response);

        const field = this.getField('wardId');

        if (!field) return;

        field.options = wards
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

      error: (error) => {
        console.error('Failed to load ward options', error);
      },
    });
  }

  onBedFieldChange(formData: Record<string, any>): void {
    const wardId = Number(formData['wardId']);

    if (!wardId || wardId === this.formWardId) return;

    this.formWardId = wardId;

    this.loadFormRoomOptions(wardId);
  }

  private loadFormRoomOptions(wardId: number): void {
    const requestId = ++this.formRequestId;

    const field = this.getField('roomId');

    if (field) field.options = [];

    this.formConfig = {
      ...this.formConfig,
      fields: [...this.formConfig.fields],
    };

    this.bedWardService.getRoomBaseOnWardId(wardId).subscribe({
      next: (response) => {
        if (requestId !== this.formRequestId) return;

        const rooms = this.extractArray(response);

        if (field) {
          field.options = rooms.map((room: any) => ({
            label: room.roomNumber,
            value: Number(room.roomId),
          }));
        }

        this.formConfig = {
          ...this.formConfig,
          fields: [...this.formConfig.fields],
        };
      },

      error: (error) => {
        console.error('Failed to load room options', error);
      },
    });
  }

  openCreateBed(): void {
    if (!this.context.roomId) return;

    this.bedFormMode = 'create';

    this.selectedBed = {
      roomId: this.context.roomId,
      wardId: this.context.wardId,
      floorId: this.context.floorId,
      floorName: this.context.floorName,
    } as unknown as Bed;

    this.showBedForm = true;

    this.prepareBedForm();
  }

  openEditBed(bed: Bed): void {
    this.bedFormMode = 'edit';

    this.selectedBed = {
      ...structuredClone(bed),
      floorId: this.context.floorId,
      floorName: this.context.floorName,
      wardId: this.context.wardId,
      roomId: this.context.roomId,
      roomNumber: this.context.roomNumber,
    } as Bed;

    this.showBedForm = true;

    this.prepareBedForm();
  }

  onBedSubmit(formData: Record<string, any>): void {
    if (this.saving) return;

    const payload = {
      roomId: Number(formData['roomId'] ?? this.context.roomId),
      bedNumber: String(formData['bedNumber'] ?? '').trim(),
      status: formData['status'],
    };

    if (!payload.roomId || !payload.bedNumber || !payload.status) {
      console.error('Please fill all required bed fields.');
      return;
    }

    this.saving = true;

    if (this.bedFormMode === 'create') {
      this.bedWardService
        .createBed(payload)
        .pipe(finalize(() => (this.saving = false)))
        .subscribe({
          next: () => this.onBedSaved(),

          error: (error) => {
            console.error('Failed to create bed', error);
          },
        });
    } else {
      const bedId =
        (this.selectedBed as any)?.bedId ?? (this.selectedBed as any)?.id;

      if (bedId == null) {
        this.saving = false;
        console.error('Bed ID is missing.');
        return;
      }

      this.bedWardService
        .updateBed(bedId, payload)
        .pipe(finalize(() => (this.saving = false)))
        .subscribe({
          next: () => this.onBedSaved(),

          error: (error) => {
            console.error('Failed to update bed', error);
          },
        });
    }
  }

  onBedSaved(): void {
    this.showBedForm = false;
    this.selectedBed = null;

    if (this.context.roomId) {
      this.loadBeds();
    }
  }

  onBedCancelled(): void {
    this.showBedForm = false;
    this.selectedBed = null;

    this.formRequestId++;
  }

  deleteBed(bed: Bed): void {
    const id = (bed as any).bedId ?? (bed as any).id;

    if (id == null) {
      console.error('Bed ID is missing');
      return;
    }

    if (!confirm(`Delete bed ${bed.bedNumber}?`)) return;

    this.bedWardService.deleteBed(id).subscribe({
      next: () => {
        this.loadBeds();
      },

      error: (error) => {
        console.error('Failed to delete bed', error);
      },
    });
  }

  openAssignment(bed: Bed): void {
    if (bed.status !== 'AVAILABLE') return;

    this.selectedBed = bed;

    this.assignment = {
      patientId: '',
      admissionId: '',
      notes: '',
    };

    this.showAssignmentDialog = true;
  }

  submitAssignment(): void {
    if (
      !this.assignment.patientId.trim() ||
      !this.assignment.admissionId.trim()
    ) {
      alert('Patient ID and Admission ID are required.');
      return;
    }

    /*
      Integration point:

      Add a patient bed assignment API to BedWardService.

      Example payload:

      {
        bedId: this.selectedBed?.bedId,
        patientId: this.assignment.patientId,
        admissionId: this.assignment.admissionId,
        notes: this.assignment.notes
      }

      Do not mark the bed OCCUPIED until the backend
      confirms the admission and assignment.
    */

    console.warn(
      'Patient assignment API is not configured yet.',
      this.assignment,
      this.selectedBed,
    );

    alert('Patient assignment API needs to be connected.');
  }
}
