import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffAvailabilityComponent } from './staff-availability.component';

describe('StaffAvailabilityComponent', () => {
  let component: StaffAvailabilityComponent;
  let fixture: ComponentFixture<StaffAvailabilityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StaffAvailabilityComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StaffAvailabilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
