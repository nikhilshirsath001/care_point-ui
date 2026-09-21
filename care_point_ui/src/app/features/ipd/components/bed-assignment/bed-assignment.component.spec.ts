import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BedAssignmentComponent } from './bed-assignment.component';

describe('BedAssignmentComponent', () => {
  let component: BedAssignmentComponent;
  let fixture: ComponentFixture<BedAssignmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BedAssignmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BedAssignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
